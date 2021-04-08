import React, { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { NodeGroup } from './components/ProxyNodeGroups'
import { fetchProxyNodes, selectProxyNodes } from './states/proxiesSlice'

export default function ProxyManager() {
  const proxyNodes = useAppSelector(selectProxyNodes)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchProxyNodes()).catch((err) => console.error(err))
  }, [dispatch])
  return <NodeGroup proxyNodes={proxyNodes}></NodeGroup>
}
