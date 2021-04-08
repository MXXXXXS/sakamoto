import { shell } from 'electron'
import { Box, Footer } from 'grommet'
import { CaretDownFill, CaretUpFill } from 'grommet-icons'
import React, { useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { useAppSelector } from '../../app/hooks'
import { TextWithIcon } from '../../common/components/TextWithIcon'
import { icons } from '../../common/style'
import { selectTraffic } from '../connections/states'
import { niceBytes } from './utils/niceBytes'

const { Github, CircleInformation } = icons

export function StatusBar() {
  const history = useHistory()
  const [trafficIsStopped, setTrafficIsStopped] = useState(false)
  const [uploadSpeed, downloadSpeed] = useAppSelector(selectTraffic)

  const [uploadSpeedText, downloadSpeedText] = useMemo(() => {
    return [`${niceBytes(uploadSpeed)}/s`, `${niceBytes(downloadSpeed)}/s`]
  }, [uploadSpeed, downloadSpeed])

  const color = useMemo(() => {
    return trafficIsStopped ? 'status-unknown' : undefined
  }, [trafficIsStopped])
  useEffect(() => {
    setTrafficIsStopped(false)
    const timer = setTimeout(() => {
      setTrafficIsStopped(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [uploadSpeed, downloadSpeed])
  return (
    <Footer background="brand" pad="small" alignSelf="stretch">
      {/* TODO info page, github link */}
      <Box justify="around" direction="row">
        <TextWithIcon
          Icon={() => <CaretUpFill color={color} />}
          text={uploadSpeedText}
        ></TextWithIcon>
        <TextWithIcon
          styles={{
            margin: {
              left: '20px',
            },
          }}
          Icon={() => <CaretDownFill color={color} />}
          text={downloadSpeedText}
        ></TextWithIcon>
      </Box>
      <Box
        style={{
          justifySelf: 'end',
        }}
        direction="row"
        width="xsmall"
        justify="around"
      >
        <CircleInformation
          onClick={() => {
            history.push('/mask/info')
          }}
        ></CircleInformation>
        <Github
          onClick={() => {
            shell
              .openExternal('https://github.com/MXXXXXS/sakamoto')
              .catch((err) => console.error(err))
          }}
        ></Github>
      </Box>
    </Footer>
  )
}
