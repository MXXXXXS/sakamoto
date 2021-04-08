import { Box, Grid, Menu, Text, Tip } from 'grommet'
import { CircleQuestion } from 'grommet-icons'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { ControlledTextInput } from '../../common/components/ControlledTextInput'
import { lineHeight } from '../../common/style'
import { LogLevel, logLevels } from './api'
import {
  selectLogLevel,
  selectLogs,
  selectMaxHistory,
  setLogLevel,
  setMaxHistory,
} from './states'

interface LogJson {
  type: LogLevel
  payload: string
}

const [minHistoryNumber, maxHistoryNumber] = [100, 2000]

function Log({ log }: { log: LogJson }) {
  return <Text size="small">{log.payload}</Text>
}

export function Logs() {
  const dispatch = useAppDispatch()
  const logs = useAppSelector(selectLogs)
  const maxHistory = useAppSelector(selectMaxHistory)
  const logLevel = useAppSelector(selectLogLevel)

  const updateMaxHistory = useCallback(
    (value: number) => {
      if (value <= maxHistoryNumber && value >= minHistoryNumber) {
        dispatch(setMaxHistory(value))
      }
    },
    [dispatch]
  )

  const changeLogLevel = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const selectedLevel = event.currentTarget.innerText as LogLevel
      if (logLevels.includes(selectedLevel) && selectedLevel !== logLevel) {
        dispatch(setLogLevel(selectedLevel)).catch((err) => console.error(err))
      }
    },
    [dispatch, logLevel]
  )

  const items = useMemo(() => {
    return logLevels.map((logLevel) => ({
      label: logLevel,
      onClick: changeLogLevel,
    }))
  }, [changeLogLevel])

  const logsOfCurrentLevel = useMemo(() => {
    return logs
      .map((log) => JSON.parse(log) as LogJson)
      .filter((logJson) => logJson.type === logLevel)
  }, [logLevel, logs])

  const logsElement = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = logsElement.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [logs])

  return (
    <Box fill>
      <Grid
        columns={['auto', 'xsmall']}
        rows={[lineHeight, lineHeight, 'fill']}
        gap="small"
        align="center"
        areas={[
          {
            name: 'logLevelLabel',
            start: [0, 0],
            end: [0, 0],
          },
          {
            name: 'logLevel',
            start: [1, 0],
            end: [1, 0],
          },
          {
            name: 'maxHistoryLabel',
            start: [0, 1],
            end: [0, 1],
          },
          {
            name: 'maxHistory',
            start: [1, 1],
            end: [1, 1],
          },
        ]}
      >
        <Text gridArea="logLevelLabel">Log level</Text>
        <Menu gridArea="logLevel" label={logLevel} items={items}></Menu>
        <Box gridArea="maxHistoryLabel" direction="row" align="center">
          <Text>Max history</Text>
          <Tip
            content={
              <Text size="xsmall">
                {`${minHistoryNumber}-${maxHistoryNumber}`}
              </Text>
            }
            dropProps={{
              align: { bottom: 'top' },
            }}
          >
            <Box>
              <CircleQuestion size="small" />
            </Box>
          </Tip>
        </Box>
        <Box gridArea="maxHistory">
          <ControlledTextInput
            controlledValue={maxHistory.toString()}
            props={{
              type: 'number',
              min: minHistoryNumber,
              max: maxHistoryNumber,
            }}
            onInput={(value) => {
              updateMaxHistory(parseInt(value))
            }}
          ></ControlledTextInput>
        </Box>
      </Grid>
      <Box ref={logsElement} fill overflow="auto">
        {logsOfCurrentLevel.map((log, index) => {
          return <Log key={index} log={log}></Log>
        })}
      </Box>
    </Box>
  )
}
