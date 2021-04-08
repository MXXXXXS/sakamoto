import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CheckBox,
  FormField,
  Grid,
  Text,
  TextInput,
} from 'grommet'
import React, { useState } from 'react'
import { Route, useHistory, useRouteMatch } from 'react-router'

import { useAppSelector } from '../../../app/hooks'
import { Mask } from '../../../common/components/Mask'
import {
  colorDark1,
  colorStatusCritical,
  icons,
  styleIconWithColor,
} from '../../../common/style'
import { selectEditingProfile } from '../states/profilesSlice'

const { Revert, Checkmark, Close, Trash } = icons

const StyledTrashIcon = styleIconWithColor(
  Trash,
  undefined,
  colorStatusCritical
)
const StyledCheckmarkIcon = styleIconWithColor(
  Checkmark,
  colorDark1,
  colorStatusCritical
)

export function ProfileEditor() {
  const history = useHistory()
  const match = useRouteMatch()
  const profile = useAppSelector(selectEditingProfile)
  const [newName, setNewName] = useState('')
  const [newSubAddr, setNewSubAddr] = useState('')
  const [subRefreshNeeded, setSubRefreshNeeded] = useState(false)

  return (
    <Grid
      fill
      rows={['full']}
      columns={['full']}
      areas={[{ name: 'main', start: [0, 0], end: [0, 0] }]}
    >
      <Card
        gridArea="main"
        background="white"
        fill
        style={{ gridArea: '1/1/4/2' }}
      >
        <CardHeader>
          <Revert></Revert>
          <Checkmark></Checkmark>
          <Close
            onClick={() => {
              history.push('/')
            }}
          ></Close>
        </CardHeader>
        <CardBody fill>
          {/* TODO handle profile editing */}
          <Grid
            rows={['auto', 'auto']}
            columns={['auto', 'xsmall']}
            gap="small"
            areas={[
              { name: 'name', start: [0, 0], end: [1, 0] },
              { name: 'subAddr', start: [0, 1], end: [1, 1] },
            ]}
          >
            <Box gridArea="name">
              <FormField label="Name">
                <TextInput
                  value={newName || profile.name}
                  onChange={(event) => {
                    setNewName(event.currentTarget.value)
                  }}
                ></TextInput>
              </FormField>
            </Box>
            <Box gridArea="subAddr">
              <FormField label="Subscription address">
                <TextInput
                  value={newSubAddr || profile.subscribeAddress}
                  onChange={(event) => {
                    setNewSubAddr(event.currentTarget.value)
                  }}
                ></TextInput>
              </FormField>
            </Box>
            <Text margin={{ left: 'small' }}>Refresh subscription </Text>
            <Box align="end">
              <CheckBox
                checked={subRefreshNeeded}
                onChange={() => {
                  setSubRefreshNeeded((needed) => !needed)
                }}
              ></CheckBox>
            </Box>
          </Grid>
        </CardBody>
        <CardFooter direction="row-reverse">
          <StyledTrashIcon
            color="status-critical"
            onClick={() => {
              history.push(`${match.url}/alert`)
            }}
          ></StyledTrashIcon>
        </CardFooter>
      </Card>
      <Route path={`${match.path}/alert`}>
        <Box fill alignSelf="stretch" gridArea="main" style={{ zIndex: 1 }}>
          <Mask>
            <Grid
              fill
              rows={['auto', '1/3', 'auto']}
              columns={['auto']}
              areas={[{ name: 'alert', start: [0, 1], end: [0, 1] }]}
            >
              <Card
                gridArea="alert"
                style={{
                  justifySelf: 'center',
                  backgroundColor: 'white',
                }}
              >
                <CardHeader style={{ color: colorStatusCritical }}>
                  DANGER
                </CardHeader>
                <CardBody>Delete this profile?</CardBody>
                <CardFooter>
                  <Close
                    onClick={() => {
                      history.goBack()
                    }}
                  ></Close>
                  <StyledCheckmarkIcon></StyledCheckmarkIcon>
                </CardFooter>
              </Card>
            </Grid>
          </Mask>
        </Box>
      </Route>
    </Grid>
  )
}
