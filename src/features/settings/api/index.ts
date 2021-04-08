import { api, apiConfigBase, messageApi } from '../../../common/api'
import { LogLevel } from '../../logs/api'
import { Mode } from '../../policySwitcher/states/policiesSlice'

export interface Config {
  port: number
  'socks-port': number
  'redir-port': number
  'tproxy-port': number
  'mixed-port': number
  'allow-lan': boolean
  mode: Mode
  'log-level': LogLevel
}

export async function getConfigApi() {
  return new Promise<Config>((resolve) => {
    messageApi({
      ...apiConfigBase,
      method: 'GET',
      path: 'configs',
      messageHandler: ([message]) => {
        resolve(JSON.parse(message))
      },
    })
  })
}

export async function changeConfigApi(body: Record<string, unknown>) {
  const [_, responseP] = api({
    ...apiConfigBase,
    method: 'PATCH',
    path: 'configs',
    body,
  })

  return await responseP
}

export function changeModeApi(mode: Mode) {
  return changeConfigApi({ mode })
}
export function changeSocksPortApi(port: number) {
  return changeConfigApi({ 'socks-port': port })
}
export function changePortApi(port: number) {
  return changeConfigApi({ port })
}

export function allowLanApi(allow: 'true' | 'false') {
  return changeConfigApi({ 'allow-lan': allow })
}
