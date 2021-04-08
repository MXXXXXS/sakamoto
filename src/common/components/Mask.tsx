import { Grid } from 'grommet'
import React from 'react'
import { Route, useHistory } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

import { colorModalMask } from '../style'

const fadeIn = keyframes`
from {
  opacity: 0;
}
to {
  opacity:  1;
}
`

const StyledGrid = styled(Grid)`
  animation: ${fadeIn} 0.2s ease-out;
  z-index: 1;
  background-color: ${colorModalMask};
`

export function Mask({ children }: { children: React.ReactNode }) {
  const history = useHistory()

  return (
    <Route path="/mask">
      <StyledGrid
        gridArea="main"
        fill
        rows={['auto', '80%', 'auto']}
        columns={['auto', '80%', 'auto']}
        areas={[{ name: 'modalBox', start: [1, 1], end: [1, 1] }]}
        onClick={() => {
          history.push('/')
        }}
      >
        <div
          style={{
            gridArea: '2/2',
          }}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          {children}
        </div>
      </StyledGrid>
    </Route>
  )
}
