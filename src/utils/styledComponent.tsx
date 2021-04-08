import { BoxProps } from 'grommet'
import React, { FunctionComponent } from 'react'

export default function styledComponent<T>(Component: FunctionComponent<T>) {
  return (style: BoxProps) => (props: Parameters<FunctionComponent<T>>[0]) => (
    <Component {...props} style={style}></Component>
  )
}
