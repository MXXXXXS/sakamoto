import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../../../app/store'
import { Policy } from '../../policySwitcher/states/policiesSlice'
import {
  setGlobalPolicies,
  setRulePolicies,
} from '../../policySwitcher/states/policiesSlice'
import {
  fetchProxyNodesApi,
  policyTypes,
  ProxyNodeLatency,
  testProxyNodeLatencyApi,
} from '../api'
import { ProxyNode } from '../components/ProxyNode'

export const testProxyNodeLatency = createAsyncThunk(
  'proxies/testProxyNodeLatency',
  async (name: string, { dispatch }) => {
    const latency = await testProxyNodeLatencyApi({ name })
    dispatch(updateProxyNodeLatency(latency))
  }
)

interface PolicyWithOutLatency extends Omit<Policy, 'proxies'> {
  proxies: string[]
}

export const fetchProxyNodes = createAsyncThunk(
  'proxies/fetchProxyNodes',
  async (_, { dispatch }) => {
    const mixedProxyNodes = await fetchProxyNodesApi()
    const globalPolicies: PolicyWithOutLatency[] = []
    const rulePoliciess: PolicyWithOutLatency[] = []
    const proxyNodes: ProxyNode[] = []

    Object.entries(mixedProxyNodes.proxies).forEach(([name, info]) => {
      // policy used in global mode
      if (name === 'GLOBAL') {
        globalPolicies.push({
          name: info.name,
          proxies: info.all || [],
          using: info.now || '',
        })
        // policies used in rule mode
      } else if (info.type === 'Selector') {
        rulePoliciess.push({
          name: info.name,
          proxies: info.all || [],
          using: info.now || '',
        })
        // info.type is name of proxy protocols (e.g. Shadowsocks, Vmess...)
      } else if (!policyTypes.includes(info.type)) {
        proxyNodes.push({
          name,
          type: info.type,
          latency: [name, info.history.pop()?.delay || Infinity],
        })
      }
    })

    dispatch(setGlobalPolicies(globalPolicies))
    dispatch(setRulePolicies(rulePoliciess))
    dispatch(setProxyNodes(proxyNodes))
  }
)

export const proxyNodesSlice = createSlice({
  name: 'proxyNodes',
  initialState: [] as ProxyNode[],
  reducers: {
    setProxyNodes: (state, action: PayloadAction<ProxyNode[]>) =>
      action.payload,
    updateProxyNodeLatency: (
      state,
      action: PayloadAction<ProxyNodeLatency>
    ) => {
      const nodeLatency = action.payload
      if (nodeLatency) {
        const nodeIndex = state.findIndex(({ name }) => name === nodeLatency[0])
        const node = state[nodeIndex]
        state.splice(nodeIndex, 1, {
          name: node.name,
          type: node.type,
          latency: nodeLatency,
        })
      }
    },
  },
})

export const { setProxyNodes, updateProxyNodeLatency } = proxyNodesSlice.actions

export const selectProxyNodes = (state: RootState) => state.proxyNodes
