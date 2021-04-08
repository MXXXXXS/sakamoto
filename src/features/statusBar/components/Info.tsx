import { Box, Card, CardBody, CardHeader, Paragraph } from 'grommet'
import React from 'react'
import { useHistory } from 'react-router'

import { icons } from '../../../common/style'

const { Close } = icons

export function Info() {
  const history = useHistory()
  return (
    <Box fill>
      <Card background="white" fill>
        <CardHeader direction="row-reverse">
          <Close
            onClick={() => {
              history.push('/')
            }}
          ></Close>
        </CardHeader>
        <CardBody fill>
          <Paragraph>A clash gui for linux.</Paragraph>
          <Paragraph>Made by MXXXXXS</Paragraph>
        </CardBody>
      </Card>
    </Box>
  )
}
