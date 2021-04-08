import { copyFile, readFile, writeFile } from 'fs/promises'
import fetch from 'node-fetch'
import { resolve } from 'path'

import {
  clashConfig,
  clashProfilesDir,
  ProfileSettings,
  profileSettings,
} from '../constants'
import { cpList } from './childProcessManagement'

export async function readProfileSettings() {
  const settingsText = await readFile(profileSettings, 'utf8')
  if (settingsText) {
    const settingsJson = JSON.parse(settingsText) as ProfileSettings
    return settingsJson
  }
}

export async function writeProfileSettings(settings: ProfileSettings) {
  return writeFile(profileSettings, JSON.stringify(settings), 'utf8')
}

export async function downloadProfile(url: string) {
  // use subconverter: https://github.com/tindy2013/subconverter
  const subconverter = cpList.subconverter.cp
  if (subconverter?.pid) {
    const convertApi = `http://localhost:25500/sub?target=clash&url=${url}`
    const response = await fetch(convertApi)
    if (response.status === 200) {
      return await response.text()
    }
  }
}

export async function switchProfile(name: string) {
  const settings = await readProfileSettings()
  if (settings) {
    const configIndex = settings.configs.findIndex(
      (config) => config.name === name
    )
    if (configIndex > -1) {
      const config = settings.configs[configIndex]
      settings.using = name
      return Promise.all([
        fetch('http://localhost:9090/configs', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: config.path }),
        }),
        copyFile(config.path, clashConfig),
        writeProfileSettings(settings),
      ])
    }
  }
}

export async function addProfile(url: string) {
  const configText = await downloadProfile(url)
  const settings = await readProfileSettings()

  if (configText && settings) {
    const downloadTime = Date.now()
    const configName = downloadTime.toString()
    const configPath = resolve(clashProfilesDir, configName)
    settings.configs.push({
      name: configName,
      path: configPath,
      subscribeAddress: url,
      downloadTime,
    })

    return Promise.all([
      writeFile(configPath, configText, 'utf8'),
      writeProfileSettings(settings),
    ])
  }
}
