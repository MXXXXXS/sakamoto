export const apiConfigBase: Pick<ApiConfigBase, 'domain' | 'controllerPort'> = {
  domain: 'localhost',
  controllerPort: 9090,
}
interface ApiConfigBase {
  domain: string
  controllerPort: number
  path: string
}

export interface ApiConfig extends ApiConfigBase {
  method: 'GET' | 'PUT' | 'PATCH'
  queries?: [name: string, value: string][]
  body?: Record<string, unknown>
}

export interface WSApiConfig<T> extends ApiConfigBase {
  messageHandler: (message: T) => void
}

export interface MessageApiConfig extends ApiConfig {
  messageHandler: (message: string[]) => void
}

export function api({
  domain,
  controllerPort,
  method,
  path,
  queries = [],
  body,
}: ApiConfig) {
  const signalController = new AbortController()
  const signal = signalController.signal
  return [
    signalController,
    fetch(
      `http://${domain}:${controllerPort}/${path}?${queries
        .map(([name, value]) => `${name}=${value}`)
        .join('&')}`,
      {
        mode: 'cors',
        method,
        body: JSON.stringify(body),
        signal: signal,
      }
    ),
  ] as [AbortController, Promise<Response>]
}

export function messageApi({
  domain,
  controllerPort,
  method,
  path,
  queries = [],
  body,
  messageHandler,
}: MessageApiConfig) {
  const [signalController, responseP] = api({
    domain,
    controllerPort,
    method,
    path,
    queries,
    body,
  })

  responseP
    .then((response) => {
      const readable = response.body?.pipeThrough(new TextDecoderStream())
      if (readable) {
        const receiver = new WritableStream({
          write(chunk: string) {
            messageHandler(chunk.split('\n').filter((log) => log))
          },
        })
        readable.pipeTo(receiver).catch((err) => console.error(err))
      }
    })
    .catch((err) => console.error(err))

  return signalController
}

export function wsApi<T>({
  domain,
  controllerPort,
  messageHandler,
  path,
}: WSApiConfig<T>) {
  const ws = new WebSocket(`ws://${domain}:${controllerPort}/${path}`)
  ws.onmessage = (event: MessageEvent) => {
    messageHandler(JSON.parse(event.data))
  }
  return ws
}
