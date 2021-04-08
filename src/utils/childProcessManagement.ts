import {
  ChildProcess,
  ChildProcessWithoutNullStreams,
  spawn,
} from 'child_process'
import { resolve } from 'path'
import tkill from 'tree-kill'
export type Log = {
  type: 1 | 2
  data: string
}

enum CpState {
  running,
  stopped,
  starting,
}

type CpList = {
  [key: string]: {
    path: string
    state: CpState
    cp: ChildProcess | null
    logs: Log[]
  }
}

export const cpList: CpList = {
  clash: {
    path: resolve(__dirname, 'clash/clash-linux-amd64-v1.4.2'),
    state: CpState.stopped,
    cp: null,
    logs: [],
  },
  subconverter: {
    path: resolve(__dirname, 'subconverter/subconverter'),
    state: CpState.stopped,
    cp: null,
    logs: [],
  },
}

export function startChildProcess(
  cpName: string
): Promise<ChildProcessWithoutNullStreams> {
  return new Promise((resolve, reject) => {
    const cpListValue = cpList[cpName]
    if (cpListValue.state === CpState.stopped) {
      cpListValue.state = CpState.starting
      const cp = spawn(cpListValue.path)
      cp.stdout.on('data', (chunk: Buffer) => {
        cpListValue.logs.push({ type: 1, data: chunk.toString('utf8') })
      })
      cp.stderr.on('data', (chunk: Buffer) => {
        cpListValue.logs.push({ type: 2, data: chunk.toString('utf8') })
      })
      cpListValue.cp = cp
      cp.on('exit', () => {
        cpListValue.state = CpState.stopped
      })
      resolve(cp)
    } else {
      let counter = 5
      const timer = setInterval(() => {
        cpListValue.cp?.kill()
        if (counter === 0) {
          reject(`Failed to kill: ${String(cpListValue.cp?.pid)}`)
        }
        if (cpListValue.cp?.killed) {
          clearInterval(timer)
          cpListValue.state = CpState.stopped
          startChildProcess(cpName)
            .then((cp) => {
              resolve(cp)
            })
            .catch((err) => reject(err))
        } else {
          counter--
        }
      }, 2000)
    }
  })
}

export function killChildProcess(cp: ChildProcess) {
  return new Promise<void>((resolve, reject) => {
    tkill(cp.pid, (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

export async function startClashAndSubconverter() {
  const clash = await startChildProcess('clash')
  const subconverter = await startChildProcess('subconverter')
}
