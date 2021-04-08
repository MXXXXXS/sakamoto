import { Box, BoxProps, Text } from 'grommet'
import { EdgeSizeType } from 'grommet/utils'
import { Icon } from 'grommet-icons'
import React from 'react'

import { textStyle } from '../style'

export function TextWithIcon({
  Icon,
  text,
  styles = {},
  size = 'small',
}: {
  Icon: Icon
  text: string
  styles?: BoxProps
  size?: EdgeSizeType
}): JSX.Element {
  return (
    <Box direction="row" align="center" {...styles}>
      <Icon size={size} />
      <Text
        style={textStyle}
        margin={{
          left: size,
        }}
        size={size}
      >
        {text}
      </Text>
    </Box>
  )
}
