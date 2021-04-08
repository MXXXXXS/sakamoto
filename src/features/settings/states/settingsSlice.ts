import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../../../app/store'
import { changePortApi, changeSocksPortApi, Config } from '../api'
import { getConfigApi } from '../api'

export const getConfig = createAsyncThunk(
  'settings/getConfig',
  async (_, { dispatch }) => {
    const config = await getConfigApi()
    dispatch(setConfig(config))
  }
)

export const changeSocksPort = createAsyncThunk(
  'settings/changeSocksPort',
  async (port: number, { dispatch }) => {
    const response = await changeSocksPortApi(port)
    if (response.ok) {
      await dispatch(getConfig()).catch((err) => console.error(err))
    }
  }
)
export const changePort = createAsyncThunk(
  'settings/changePort',
  async (port: number, { dispatch }) => {
    const response = await changePortApi(port)
    if (response.ok) {
      await dispatch(getConfig()).catch((err) => console.error(err))
    }
  }
)

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    config: {
      port: 0,
      'socks-port': 0,
      'redir-port': 0,
      'tproxy-port': 0,
      'mixed-port': 0,
      'allow-lan': false,
      mode: 'rule',
      'log-level': 'info',
    } as Config,
    startWithSystem: false,
    setAsSystemProxy: false,
  },
  reducers: {
    setConfig: (state, action: PayloadAction<Config>) => {
      state.config = action.payload
    },
  },
})

export const { setConfig } = settingsSlice.actions

export const selectPorts = (state: RootState) => {
  return {
    http: state.settings.config.port,
    socks5: state.settings.config['socks-port'],
  }
}
