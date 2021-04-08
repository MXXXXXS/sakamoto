import { Box, BoxProps, Text, TextInput } from 'grommet'
import { EdgeSizeType } from 'grommet/utils'
import React from 'react'

export function TextInputWithLabel({
  label,
  value = '',
  styles = {},
  type = 'text',
  size = 'small',
  onChange = undefined,
}: {
  label: string
  value?: string
  styles?: BoxProps
  type?: string
  size?: EdgeSizeType
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
}): JSX.Element {
  return (
    <Box direction="row" width={size} align="center" {...styles}>
      <Text margin={{ right: size }} size={size}>
        {label}
      </Text>
      <TextInput
        size={size}
        type={type}
        value={value}
        onChange={onChange}
      ></TextInput>
    </Box>
  )
}
