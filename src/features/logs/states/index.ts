import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../../../app/store'
import { getLogsApi, LogLevel } from '../api'

let controller: AbortController

export const setLogLevel = createAsyncThunk(
  'logs/setLevel',
  (level: LogLevel, { dispatch }) => {
    const messageHandler = (message: string[]) => {
      dispatch(setLogs(message))
    }
    controller?.abort()
    controller = getLogsApi({ messageHandler, level })
    dispatch(setLevel(level))
  }
)

export const logsSlice = createSlice({
  name: 'logs',
  initialState: {
    level: 'info' as LogLevel,
    logs: [] as string[],
    maxHistory: 200,
  },
  reducers: {
    setLogs: (state, action: PayloadAction<string[]>) => {
      const maxHistory = state.maxHistory
      state.logs.push(...action.payload)
      // Avoid logs dropped every time when logs.length >= maxHistory on pushing payload
      // which will cause UI refresh twice
      // Here use magic number 100 as caching size
      if (state.logs.length > 100 + maxHistory) {
        state.logs.splice(state.logs.length - maxHistory)
      }
    },
    setLevel: (state, action: PayloadAction<LogLevel>) => {
      state.level = action.payload
    },
    setMaxHistory: (state, action: PayloadAction<number>) => {
      state.maxHistory = action.payload
    },
  },
})

export const { setLogs, setMaxHistory, setLevel } = logsSlice.actions

export const selectLogLevel = (state: RootState) => state.logs.level
export const selectLogs = (state: RootState) => state.logs.logs
export const selectMaxHistory = (state: RootState) => state.logs.maxHistory
