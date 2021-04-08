import { Box, Button, Grid, TextInput } from 'grommet'
import { Download, Link } from 'grommet-icons'
import React, { useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { lineHeight } from '../../common/style'
import { ProfileCards } from './components/ProfileCard'
import styles from './css/index.module.css'
import { addProfile, listProfiles } from './states/profilesSlice'

export default function ProfileManager() {
  const dispatch = useAppDispatch()
  const profileSettings = useAppSelector((state) => state.profileSettings)
  const [link, setLink] = useState('')
  const [downloadable, setDownloadable] = useState(true)
  useEffect(() => {
    dispatch(listProfiles()).catch((err) => {
      console.error(err)
    })
  }, [dispatch])
  return (
    <Box>
      <Grid
        rows={[lineHeight, 'auto']}
        columns={['auto', 'xsmall']}
        areas={[
          { name: 'textInput', start: [0, 0], end: [0, 0] },
          { name: 'button', start: [1, 0], end: [1, 0] },
          { name: 'profiles', start: [0, 1], end: [1, 1] },
        ]}
        gap="small"
        align="center"
      >
        <Box gridArea="textInput">
          <TextInput
            type="url"
            value={link}
            icon={<Link className={styles.icon} />}
            onChange={(event) => {
              setLink(event.currentTarget.value)
            }}
          ></TextInput>
        </Box>
        <Button
          gridArea="button"
          primary={downloadable}
          icon={<Download />}
          style={{
            textAlign: 'center',
          }}
          // label={downloadable ? 'Download' : 'Downloading'}
          onClick={() => {
            if (downloadable) {
              setDownloadable(false)
              dispatch(addProfile(link))
                .catch((err) => {
                  console.error(err)
                })
                .finally(() => {
                  setDownloadable(true)
                })
            }
          }}
        ></Button>
        <Box gridArea="profiles">
          <ProfileCards profiles={profileSettings.configs}></ProfileCards>
        </Box>
      </Grid>
    </Box>
  )
}
