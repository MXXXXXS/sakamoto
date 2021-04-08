import { Accordion, AccordionPanel, Box, Button, Grid } from 'grommet'
import React, { useCallback, useEffect, useState } from 'react'

import { useAppDispatch } from '../../../app/hooks'
import { testProxyNodeLatency } from '../states/proxiesSlice'
import ProxyNodeComponent, {
  latencyColors,
  lowLatencyBoundary,
  mediumLatencyBoundary,
  ProxyNode,
} from './ProxyNode'

function AccordionLabel({
  percent,
  color,
}: {
  percent: number
  color: string
}) {
  return (
    <div
      style={{
        backgroundColor: color,
        width: `${percent}%`,
        height: '10px',
      }}
    ></div>
  )
}

export function NodeGroup({ proxyNodes }: { proxyNodes: ProxyNode[] }) {
  const [isTesting, setIsTesting] = useState<boolean>(false)
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const dispatch = useAppDispatch()

  const lowLatencyNodes: ProxyNode[] = []
  const mediumLatencyNodes: ProxyNode[] = []
  const highLatencyNodes: ProxyNode[] = []
  const deadNodes: ProxyNode[] = []

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [setIsMounted])

  const testLatency = useCallback(() => {
    setIsTesting(true)
    Promise.all(
      proxyNodes.map((proxyNode) =>
        dispatch(testProxyNodeLatency(proxyNode.name)).catch((err) =>
          console.error(err)
        )
      )
    )
      .then(() => {
        if (isMounted) {
          setIsTesting(false)
        }
      })
      .catch((err) => console.error(err))
  }, [dispatch, proxyNodes, isMounted])

  ;[...proxyNodes]
    .sort((a, b) => a.latency[1] - b.latency[1])
    .forEach((proxyNode) => {
      const latency = proxyNode.latency[1]
      switch (true) {
        case latency === Infinity:
          deadNodes.push(proxyNode)
          break
        case latency < lowLatencyBoundary:
          lowLatencyNodes.push(proxyNode)
          break
        case latency < mediumLatencyBoundary:
          mediumLatencyNodes.push(proxyNode)
          break
        default:
          highLatencyNodes.push(proxyNode)
          break
      }
    })
  const nodesWithDifferentLatencies = [
    lowLatencyNodes,
    mediumLatencyNodes,
    highLatencyNodes,
    deadNodes,
  ]
  return (
    <Box
      justify="center"
      flex={{
        shrink: 0,
      }}
    >
      <Button
        primary={!isTesting}
        secondary={isTesting}
        style={{ textAlign: 'center' }}
        onClick={testLatency}
        label={isTesting ? 'Testing ' : 'Test latency'}
      ></Button>
      <Accordion overflow="auto" margin="small">
        {nodesWithDifferentLatencies.map((nodes, index) => (
          <AccordionPanel
            key={index}
            label={
              <AccordionLabel
                percent={Math.round((100 * nodes.length) / proxyNodes.length)}
                color={latencyColors[index]}
              ></AccordionLabel>
            }
          >
            <Grid
              fill="vertical"
              columns={{ count: 'fit', size: 'xsmall' }}
              gap="small"
            >
              {nodes.map((proxyNode) => (
                <ProxyNodeComponent
                  key={proxyNode.name}
                  proxyNode={proxyNode}
                ></ProxyNodeComponent>
              ))}
            </Grid>
          </AccordionPanel>
        ))}
      </Accordion>
    </Box>
  )
}
