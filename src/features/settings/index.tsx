import { Grid, Menu, Text } from 'grommet'
import React, { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { ControlledTextInput } from '../../common/components/ControlledTextInput'
import {
  changeMode,
  modes,
  selectUsingMode,
} from '../policySwitcher/states/policiesSlice'
import {
  changePort,
  changeSocksPort,
  getConfig,
  selectPorts,
} from './states/settingsSlice'

export default function Settings() {
  const { http, socks5 } = useAppSelector(selectPorts)
  const usingMode = useAppSelector(selectUsingMode)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getConfig()).catch((err) => console.error(err))
  }, [dispatch])
  return (
    <Grid
      columns={['auto', 'xsmall']}
      align="center"
      gap="small"
      alignSelf="stretch"
    >
      <Text>Http</Text>
      <ControlledTextInput
        controlledValue={http.toString()}
        props={{ type: 'number' }}
        onInput={(value) => {
          dispatch(changePort(parseInt(value))).catch((err) =>
            console.error(err)
          )
        }}
      ></ControlledTextInput>
      <Text>Socks5</Text>
      <ControlledTextInput
        controlledValue={socks5.toString()}
        props={{ type: 'number' }}
        onInput={(value) => {
          dispatch(changeSocksPort(parseInt(value))).catch((err) =>
            console.error(err)
          )
        }}
      ></ControlledTextInput>
      <Text>Mode</Text>
      <Menu
        label={usingMode}
        items={modes.map((mode) => ({
          label: mode,
          onClick: () => {
            dispatch(changeMode({ mode })).catch((err) => console.error(err))
          },
        }))}
      ></Menu>
    </Grid>
  )
}
