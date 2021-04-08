import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { find } from 'lodash'

import { RootState } from '../../../app/store'
import { Profile, ProfileSettings } from '../../../constants'
import {
  addProfileFrom,
  changeProfile as ipcChangeProfile,
  listProfiles as ipcListProfiles,
  NameChange,
  renameProfile as ipcRenameProfile,
} from '../../../ipc'
import { fetchProxyNodes } from '../../proxyManager/states/proxiesSlice'

export const listProfiles = createAsyncThunk(
  'profileSettings/listProfiles',
  async (_, { dispatch }) => {
    const profileSettings = await ipcListProfiles()
    if (profileSettings) {
      dispatch(setProfileSettings(profileSettings))
    }
  }
)

export const renameProfile = createAsyncThunk(
  'profileSettings/changeProfile',
  async (nameChange: NameChange, { dispatch }) => {
    await ipcRenameProfile(nameChange)
    await dispatch(listProfiles())
  }
)

export const changeProfile = createAsyncThunk(
  'profileSettings/changeProfile',
  async (name: string, { dispatch }) => {
    const succeed = await ipcChangeProfile(name)
    if (succeed) {
      await dispatch(fetchProxyNodes())
      return name
    }
  }
)

export const addProfile = createAsyncThunk(
  'profileSettings/addProfile',
  async (link: string) => {
    await addProfileFrom(link).catch((err) => console.error(err))
    const profileSettings = await ipcListProfiles()
    if (profileSettings) {
      setProfileSettings(profileSettings)
    }
  }
)

interface ProfileSettingsInitialState extends ProfileSettings {
  editing: string
}

export const profileSettingsSlice = createSlice({
  name: 'profileSettings',
  initialState: {
    using: '',
    editing: '',
    configs: [],
  } as ProfileSettingsInitialState,
  reducers: {
    setProfileSettings: (state, action: PayloadAction<ProfileSettings>) => {
      return { ...action.payload, editing: state.editing }
    },
    setUsing: (state, action: PayloadAction<string>) => {
      state.using = action.payload
    },
    setEditing: (state, action: PayloadAction<string>) => {
      state.editing = action.payload
    },
    addProfile: (state, action: PayloadAction<Profile>) => {
      const profile = action.payload
      state.configs.push(profile)
    },
    rmProfile: (state, action: PayloadAction<string>) => {
      const name = action.payload
      const profiles = state.configs
      const profileIndex = profiles.findIndex(
        (profile) => profile.name === name
      )
      state.configs.splice(profileIndex, 1)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(changeProfile.fulfilled, (state, action) => {
      const name = action.payload
      if (name) {
        state.using = name
      }
    })
  },
})

export const {
  setProfileSettings,
  setUsing,
  setEditing,
} = profileSettingsSlice.actions

export const selectProfileSettings = (state: RootState) => state.profileSettings
export const selectEditingProfile = (state: RootState) => {
  const { editing, configs } = selectProfileSettings(state)
  return (
    find(configs, ({ name }) => {
      return name === editing
    }) ||
    ({ name: '', subscribeAddress: '', path: '', downloadTime: 0 } as Profile)
  )
}
