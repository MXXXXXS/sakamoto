import { configureStore } from '@reduxjs/toolkit'

import { connectionsSlice } from '../features/connections/states'
import { logsSlice } from '../features/logs/states'
import { policiesSlice } from '../features/policySwitcher/states/policiesSlice'
import { profileSettingsSlice } from '../features/profileManager/states/profilesSlice'
import { proxyNodesSlice } from '../features/proxyManager/states/proxiesSlice'
import { settingsSlice } from '../features/settings/states/settingsSlice'

export const store = configureStore({
  reducer: {
    policies: policiesSlice.reducer,
    profileSettings: profileSettingsSlice.reducer,
    settings: settingsSlice.reducer,
    proxyNodes: proxyNodesSlice.reducer,
    logs: logsSlice.reducer,
    connections: connectionsSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
