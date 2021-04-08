import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../../../app/store'
import { changeModeApi } from '../../settings/api'
import { changeProxyApi } from '../api'

export interface Policy {
  name: string
  proxies: string[]
  using: string
}

export const modes = ['global', 'rule', 'direct'] as const
export type Mode = typeof modes[number]
export type UsingProxy = [policyName: string, proxyName: string]

type PolicySelectedInitialState = {
  [key in Mode]: string
}

const policySelectedInitialState: PolicySelectedInitialState = {
  global: '',
  rule: '',
  direct: '',
}
type PoliciesInitialState = {
  [key in Mode]: Policy[]
}
const policiesInitialState: PoliciesInitialState = {
  global: [
    {
      name: 'global',
      proxies: [],
      using: 'global',
    },
  ],
  rule: [],
  direct: [
    {
      name: 'direct',
      proxies: [],
      using: 'direct',
    },
  ],
}
export const policiesSlice = createSlice({
  name: 'policies',
  initialState: {
    usingMode: 'rule' as Mode,
    policySelected: policySelectedInitialState,
    policies: policiesInitialState,
  },
  reducers: {
    setUsingMode: (state, action: PayloadAction<Mode>) => {
      const mode = action.payload
      state.usingMode = mode
    },
    setUsingProxy: (state, action: PayloadAction<UsingProxy>) => {
      const mode = state.usingMode
      const [policyName, proxyName] = action.payload
      const policyGroups = state.policies[mode]
      for (let index = 0; index < policyGroups.length; index++) {
        const policy = policyGroups[index]
        if (policy.name === policyName) {
          policy.using = proxyName
          break
        }
      }
    },
    setGlobalPolicies: (state, action: PayloadAction<Policy[]>) => {
      state.policies.global = action.payload
    },
    setRulePolicies: (state, action: PayloadAction<Policy[]>) => {
      state.policies.rule = action.payload
    },
    setPolicySelected: (state, action: PayloadAction<string>) => {
      const mode = state.usingMode
      state.policySelected[mode] = action.payload
    },
  },
})

export const {
  setUsingMode,
  setUsingProxy,
  setGlobalPolicies,
  setRulePolicies,
  setPolicySelected,
} = policiesSlice.actions

export const selectUsingMode = (state: RootState) => state.policies.usingMode
export const selectPolicies = (state: RootState) => state.policies.policies
export const selectPolicySelected = (state: RootState) => {
  const mode = selectUsingMode(state)
  return state.policies.policySelected[mode]
}
export const selectUsingPolicies = (state: RootState) => {
  const mode = selectUsingMode(state)
  return state.policies.policies[mode]
}
export const selectGlobalPolicies = (state: RootState) =>
  state.policies.policies.global
export const selectRulePolicies = (state: RootState) =>
  state.policies.policies.rule
export const selectDirectPolicies = (state: RootState) =>
  state.policies.policies.direct

export const changeMode = createAsyncThunk(
  'policies/changeMode',
  async ({ mode }: { mode: Mode }, { dispatch }) => {
    const response = await changeModeApi(mode)
    if (response.ok) dispatch(setUsingMode(mode))
  }
)
export const changeProxy = createAsyncThunk(
  'policies/changeProxy',
  async (
    { policy, proxy }: { policy: string; proxy: string },
    { dispatch }
  ) => {
    const response = await changeProxyApi({ policy, proxy })
    if (response.ok) dispatch(setUsingProxy([policy, proxy]))
  }
)
