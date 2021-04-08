import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { find } from 'lodash'

import { RootState } from '../../../app/store'
import { Connections, getConnectionsApi } from '../api'
import { SortType as SortTypeName } from '../index'

type SortType = {
  using: SortTypeName
  types: { name: string; filter: string }[]
}
export interface ConnectionsState extends Connections {
  connections: (Connections['connections'][number] & {
    uploadSpeed: number
    downloadSpeed: number
  })[]
  sortType: SortType
}
let controller: WebSocket

export const getConnections = createAsyncThunk(
  'connections/get',
  (_, { dispatch }) => {
    const messageHandler: Parameters<
      typeof getConnectionsApi
    >[0]['messageHandler'] = (message) => {
      dispatch(setConnections(message))
    }
    controller?.close()
    controller = getConnectionsApi({ messageHandler })
  }
)

export const connectionsSlice = createSlice({
  name: 'connections',
  initialState: {
    uploadTotal: 0,
    downloadTotal: 0,
    connections: [],
    sortType: {
      using: 'default',
      types: [],
    },
  } as ConnectionsState,
  reducers: {
    setConnections: (state, action: PayloadAction<Connections>) => {
      const { connections: previousConnections, sortType } = state
      const { connections: currentConnections } = action.payload
      const currentConnectionsWithSpeedAdded = currentConnections.map(
        (currentConnection) => {
          const { id } = currentConnection
          const previousConnection = find(
            previousConnections,
            ({ id: preId }) => preId === id
          )
          const { upload, download } = currentConnection
          if (previousConnection) {
            const {
              upload: preUpload,
              download: preDownload,
            } = previousConnection
            const [uploadSpeed, downloadSpeed] = [
              upload - preUpload,
              download - preDownload,
            ]
            return {
              ...currentConnection,
              uploadSpeed,
              downloadSpeed,
            }
          }
          return {
            ...currentConnection,
            uploadSpeed: upload,
            downloadSpeed: download,
          }
        }
      )
      return {
        ...action.payload,
        connections: currentConnectionsWithSpeedAdded,
        sortType,
      }
    },
    setFilter: (state, action: PayloadAction<[string, string]>) => {
      const [name, filter] = action.payload
      const types = state.sortType.types
      const sortType = find(types, ({ name: n }) => n === name)
      if (sortType) {
        sortType.filter = filter
      } else {
        types.push({ name, filter })
      }
    },
    setSortTypeName: (state, action: PayloadAction<SortTypeName>) => {
      state.sortType.using = action.payload
    },
  },
})

export const {
  setConnections,
  setFilter,
  setSortTypeName,
} = connectionsSlice.actions

export const selectConnections = (state: RootState) =>
  state.connections.connections
export const selectTraffic = (state: RootState) => {
  const { connections } = state.connections
  return connections.reduce(
    (accumulator, connection) => {
      const { uploadSpeed, downloadSpeed } = connection
      return [accumulator[0] + uploadSpeed, accumulator[1] + downloadSpeed]
    },
    [0, 0]
  )
}
export const selectUsingSortTypeName = (state: RootState) =>
  state.connections.sortType.using
export const selectUsingFilter = (state: RootState) => {
  const name = selectUsingSortTypeName(state)
  const { filter = '' } =
    find(state.connections.sortType.types, ({ name: n }) => n === name) || {}
  return filter
}
