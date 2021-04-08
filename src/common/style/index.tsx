import { ThemeType } from 'grommet'
import {
  Actions,
  Checkmark,
  CircleInformation,
  Close,
  Github,
  Revert,
  Trash,
} from 'grommet-icons'
import React from 'react'
import styled from 'styled-components'

export const textStyle: React.CSSProperties = {
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
}

export const lineHeight = '50px'
export const iconHeight = '24px'

export const fontSize = 15

/* https://v2.grommet.io/color */
export const colorBrand = '#7D4CDB'
export const colorLight6 = '#DADADA'
export const colorStatusCritical = '#FF4040'
export const colorDark1 = '#333333'

export const colorModalMask = '#DADADADA'

export const theme: ThemeType = {
  global: {
    font: {
      size: 'large',
    },
  },
  tabs: {
    gap: 'xsmall',
  },
  tab: {
    border: {
      size: 'small',
    },
    margin: {
      vertical: 'small',
    },
  },
  card: {
    container: {
      pad: 'small',
      width: 'small',
    },
    header: {
      pad: 'xsmall',
    },
    body: {
      pad: {
        left: 'xsmall',
      },
    },
  },
  checkBox: {
    toggle: {
      color: {
        light: colorLight6,
      },
    },
  },
}
// TODO: move to common as a wrapper of icons
export function styleIcon(component: Parameters<typeof styled>[number]) {
  return styled(component)`
    :hover {
      cursor: pointer;
    }
  `
}

export const icons = {
  Close: styleIcon(Close),
  CircleInformation: styleIcon(CircleInformation),
  Revert: styleIcon(Revert),
  Checkmark: styleIcon(Checkmark),
  Github: styleIcon(Github),
  Trash: styleIcon(Trash),
  Actions: styleIcon(Actions),
}

export function styleIconWithColor(
  component: Parameters<typeof styled>[number],
  color = colorLight6,
  hoverColor = colorBrand
) {
  return styled(styleIcon(component))`
    :hover {
      stroke: ${hoverColor};
    }
    stroke: ${color};
  `
}
