import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'fs'
import { homedir } from 'os'
import { resolve } from 'path'

export interface ProfileSettings {
  using: string
  configs: Profile[]
}
export interface Profile {
  name: string
  path: string
  subscribeAddress: string
  downloadTime: number
}
const home = homedir()

export const clashProfilesDir = `${home}/.config/clash/profiles`
export const profileSettings = `${home}/.config/clash/profiles/.settings.json`
export const clashConfigDir = `${home}/.config/clash`
export const clashConfig = `${home}/.config/clash/config.yaml`

if (!existsSync(clashProfilesDir)) {
  try {
    mkdirSync(clashProfilesDir, { recursive: true })
  } catch (err) {
    console.error(err)
  }
}

if (!existsSync(profileSettings)) {
  try {
    const defaultConfigPath = resolve(clashProfilesDir, 'default')
    const settings: ProfileSettings = {
      using: 'default',
      configs: [
        {
          name: 'default',
          path: defaultConfigPath,
          subscribeAddress: '',
          downloadTime: Date.now(),
        },
      ],
    }
    copyFileSync(clashConfig, defaultConfigPath)
    writeFileSync(profileSettings, JSON.stringify(settings), {
      encoding: 'utf8',
    })
  } catch (err) {
    console.error(err)
  }
}
