import { apiConfigBase, messageApi } from '../../../common/api'
import { onSubconverterLogs } from '../../../ipc'

export const logLevels = ['info', 'warning', 'error', 'debug'] as const
export type LogLevel = typeof logLevels[number]
export function getLogsApi({
  level = 'info',
  messageHandler,
}: {
  level?: LogLevel
  messageHandler: (message: string[]) => void
}) {
  return messageApi({
    ...apiConfigBase,
    method: 'GET',
    path: 'logs',
    queries: [['level', level]],
    messageHandler,
  })
}

onSubconverterLogs()
