//https://clash.gitbook.io/doc/restful-api/proxies

import { apiConfigBase, messageApi } from '../../../common/api'

export const policyTypes = ['Direct', 'Selector', 'Reject', 'URLTest']
type ProxyType = 'Direct' | 'Selector' | 'Reject' | 'URLTest' | string

type ProxyHistory = {
  time: string
  delay: number
}

export type ProxyInfo = {
  type: ProxyType
  name: string
  history: ProxyHistory[]
  all: ProxyInfo['type'] extends 'Selector' ? string[] : undefined
  now: ProxyInfo['type'] extends 'Selector' | 'URLTest' ? string : undefined
}

export interface FetchProxyNodesResponseJson {
  proxies: {
    DIRECT: ProxyInfo
    GLOBAL: ProxyInfo
    REJECT: ProxyInfo
    [policyGroupName: string]: ProxyInfo
  }
}

export async function fetchProxyNodesApi() {
  return new Promise((resolve) => {
    messageApi({
      ...apiConfigBase,
      method: 'GET',
      path: 'proxies',
      messageHandler: ([message]) => {
        const messageJson = JSON.parse(message) as FetchProxyNodesResponseJson
        resolve(messageJson)
      },
    })
  })
}

type ResponseMessage =
  | {
      delay: number
    }
  | {
      message: string
    }

export type ProxyNodeLatency = [name: string, latency: number]

export function testProxyNodeLatencyApi({
  name,
}: {
  name: string
}): Promise<ProxyNodeLatency> {
  return new Promise((resolve) => {
    messageApi({
      ...apiConfigBase,
      method: 'GET',
      path: `proxies/${name}/delay?timeout=3000&url=http://www.gstatic.com/generate_204`,
      messageHandler: ([message]) => {
        const messageJson = JSON.parse(message) as ResponseMessage
        if (messageJson) {
          if ('delay' in messageJson) {
            resolve([name, messageJson.delay])
          }
          resolve([name, Infinity])
        }
      },
    })
  })
}
