import { api, apiConfigBase } from '../../../common/api'

export async function changeProxyApi({
  proxy,
  policy,
}: {
  proxy: string
  policy: string
}) {
  const [_, responseP] = api({
    ...apiConfigBase,
    method: 'PUT',
    path: `proxies/${policy}`,
    body: { name: proxy },
  })

  return await responseP
}
