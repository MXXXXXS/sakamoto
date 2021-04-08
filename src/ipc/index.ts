import { ipcMain, ipcRenderer, WebContents } from 'electron'

import { ProfileSettings } from '../constants'
import { cpList, Log } from '../utils/childProcessManagement'
import {
  addProfile,
  readProfileSettings,
  switchProfile,
  writeProfileSettings,
} from '../utils/profileManagement'

export type NameChange = {
  oldName: string
  newName: string
}

export const RENAME_PROFILE = 'renameProfile'

export function onRenameProfile() {
  ipcMain.handle(
    RENAME_PROFILE,
    async (event, { oldName, newName }: NameChange) => {
      const settings = await readProfileSettings()
      if (settings) {
        const { configs } = settings
        const index = configs.findIndex(({ name }) => name === oldName)
        if (index > -1) {
          configs[index].name = newName
          await writeProfileSettings(settings)
        }
      }
    }
  )
}

export function renameProfile(nameChange: NameChange) {
  return ipcRenderer.invoke(RENAME_PROFILE, nameChange)
}

export const CHANGE_PROFILE = 'changeProfile'

export function onChangeProfile() {
  ipcMain.handle(CHANGE_PROFILE, async (event, name: string) => {
    return switchProfile(name)
  })
}

export async function changeProfile(name: string) {
  return (await ipcRenderer.invoke(CHANGE_PROFILE, name)) as boolean
}

export const ADD_PROFILE_FROM = 'addProfileFrom'

export function onAddProfileFrom() {
  ipcMain.handle(ADD_PROFILE_FROM, async (event, url: string) => {
    return await addProfile(url)
  })
}

export async function addProfileFrom(url: string) {
  await ipcRenderer.invoke(ADD_PROFILE_FROM, url)
}

export const LIST_PROFILES = 'listProfiles'

export function onListProfiles() {
  ipcMain.handle(LIST_PROFILES, async (event) => {
    return readProfileSettings()
  })
}

export async function listProfiles() {
  return (await ipcRenderer.invoke(LIST_PROFILES)) as ProfileSettings
}

const SUBCONVERTER_LOGS = 'subconverterLogs'

export function onSubconverterLogs() {
  ipcRenderer.on(SUBCONVERTER_LOGS, (event, logs: Log[]) => {
    const logsText = logs.map((log) => log.data).join('\n')
    // TODO: render logs in app
    // console.log(logsText)
  })
}

export function subconverterLogs(webContents: WebContents) {
  const logs = cpList.subconverter.logs
  webContents.send(SUBCONVERTER_LOGS, logs)
}

export function registIpcHandlers() {
  onAddProfileFrom()
  onChangeProfile()
  onListProfiles()
}
