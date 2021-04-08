import { Card, CardBody, CardHeader, Text } from 'grommet'
import { Wifi, WifiMedium, WifiNone } from 'grommet-icons'
import React from 'react'

import { textStyle } from '../../../common/style'
import { ProxyNodeLatency } from '../api'
export interface ProxyNode {
  latency: ProxyNodeLatency
  name: string
  type: string
}

export const lowLatencyBoundary = 200
export const mediumLatencyBoundary = 500
// https://v2.grommet.io/color
export const latencyColors = ['#00C781', '#FFAA15', '#FF4040', '#CCCCCC']

const latencyMap = [
  {
    color: latencyColors[0],
    Icon: ({ size }: { size: string }) => <Wifi size={size}></Wifi>,
    latency: [0, lowLatencyBoundary],
  },
  {
    color: latencyColors[1],
    Icon: ({ size }: { size: string }) => <WifiMedium size={size}></WifiMedium>,
    latency: [lowLatencyBoundary, mediumLatencyBoundary],
  },
  {
    color: latencyColors[2],
    // wifiLow icon not visible, see: https://github.com/grommet/grommet-icons/issues/224
    // Icon: () => <WifiLow></WifiLow>,
    Icon: ({ size }: { size: string }) => <WifiMedium size={size}></WifiMedium>,
    latency: [mediumLatencyBoundary, Infinity],
  },
  {
    color: latencyColors[3],
    Icon: ({ size }: { size: string }) => <WifiNone size={size}></WifiNone>,
    latency: [Infinity, Infinity],
  },
]

export function mapTo(
  type: 'latency',
  value: ProxyNodeLatency
): typeof latencyMap[number]
export function mapTo(
  type: 'index',
  value: 0 | 1 | 2 | 3
): typeof latencyMap[number]
export function mapTo(
  type: unknown,
  value: unknown
): typeof latencyMap[number] | undefined {
  //https://colorhunt.co/palette/219735
  if (type === 'latency') {
    const latency = (value as ProxyNodeLatency)[1]
    for (let index = 0; index < latencyMap.length; index++) {
      const element = latencyMap[index]
      const [latencyBoundaryStart, latencyBoundaryEnd] = element.latency
      if (latencyBoundaryStart <= latency && latency < latencyBoundaryEnd) {
        return element
      }
    }
    return latencyMap.slice(-1)[0]
  } else if (type === 'index') {
    return latencyMap[value as number]
  }
}

export default function ProxyNode({
  proxyNode,
  size = 15,
}: {
  proxyNode: ProxyNode
  size?: number
}) {
  const { Icon: LatencyIcon, color } = mapTo('latency', proxyNode.latency)
  const latencyText =
    proxyNode.latency[1] !== Infinity ? proxyNode.latency[1] : 'Timeout'

  const fontSize = size.toString() + 'px'
  const lineHeight = (size * 1.5).toString() + 'px'
  return (
    <Card pad="none">
      <CardHeader
        pad="xsmall"
        height={lineHeight}
        background={{
          color: color,
        }}
      >
        <LatencyIcon size="15px"></LatencyIcon>
        <Text size={fontSize}>{latencyText}</Text>
      </CardHeader>
      <CardBody pad="xsmall">
        <Text size={fontSize} style={textStyle}>
          {proxyNode.name}
        </Text>
        <Text size={fontSize} style={textStyle}>
          {proxyNode.type}
        </Text>
      </CardBody>
    </Card>
  )
}
