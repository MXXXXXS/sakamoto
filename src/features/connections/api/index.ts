import { apiConfigBase, wsApi, WSApiConfig } from '../../../common/api'

export interface Connections {
  downloadTotal: number
  uploadTotal: number
  connections: {
    chains: string[]
    id: string
    metadata: {
      destinationIP: string
      destinationPort: number
      host: string
      network: string
      sourceIP: string
      sourcePort: number
      type: string
    }
    rule: string
    rulePayload: string
    start: string
    upload: number
    download: number
  }[]
}

export function getConnectionsApi({
  messageHandler,
}: {
  messageHandler: WSApiConfig<Connections>['messageHandler']
}) {
  return wsApi<Connections>({
    ...apiConfigBase,
    path: 'connections',
    messageHandler,
  })
}
