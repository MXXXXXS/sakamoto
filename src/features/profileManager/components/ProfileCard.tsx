import formatDistance from 'date-fns/formatDistance'
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  CheckBox,
  Grid,
  Grommet,
  Text,
} from 'grommet'
import { Domain, History } from 'grommet-icons'
import React from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { TextWithIcon } from '../../../common/components/TextWithIcon'
import { icons, styleIconWithColor, theme } from '../../../common/style'
import { Profile } from '../../../constants'
import { selectProfileSettings, setEditing } from '../states/profilesSlice'
import { changeProfile } from '../states/profilesSlice'

const StyledActions = styled(styleIconWithColor(icons.Actions))`
  margin-right: 3px;
`

export function ProfileCard({ profile }: { profile: Profile }): JSX.Element {
  const history = useHistory()
  const profileSettings = useAppSelector(selectProfileSettings)
  const dispatch = useAppDispatch()
  let hostname = ''
  try {
    hostname = new URL(profile.subscribeAddress).hostname
  } catch {
    //
  }

  return (
    <Card>
      <CardHeader>
        <Text>{profile.name}</Text>
        <Grommet theme={theme}>
          <CheckBox
            checked={profileSettings.using === profile.name}
            onChange={() => {
              dispatch(changeProfile(profile.name)).catch((err) => {
                console.error(err)
              })
            }}
          ></CheckBox>
        </Grommet>
      </CardHeader>
      <CardBody>
        <TextWithIcon Icon={Domain} text={hostname}></TextWithIcon>
        <Box direction="row" justify="between">
          <TextWithIcon
            Icon={History}
            text={formatDistance(profile.downloadTime, Date.now())}
          ></TextWithIcon>
          <StyledActions
            onClick={() => {
              dispatch(setEditing(profile.name))
              history.push('/mask/profileEditor')
            }}
          ></StyledActions>
        </Box>
      </CardBody>
    </Card>
  )
}

export function ProfileCards({
  profiles,
}: {
  profiles: Profile[]
}): JSX.Element {
  return (
    <Grid
      columns={{ count: 'fit', size: 'small' }}
      gap="small"
      pad="small"
      align="center"
      justify="center"
    >
      {profiles.map((profile) => (
        <Grommet key={profile.name} theme={theme}>
          <ProfileCard profile={profile}></ProfileCard>
        </Grommet>
      ))}
    </Grid>
  )
}
