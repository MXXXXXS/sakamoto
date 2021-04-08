import { Box, Button, Text } from 'grommet'
import { Ascend, Descend, Filter } from 'grommet-icons'
import { filter, sortBy } from 'lodash'
import { parseDomain, ParseResultType } from 'parse-domain'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { ControlledTextInput } from '../../common/components/ControlledTextInput'
import {
  colorBrand,
  colorLight6,
  iconHeight,
  styleIconWithColor,
} from '../../common/style'
import {
  selectConnections,
  selectUsingFilter,
  selectUsingSortTypeName,
  setFilter,
  setSortTypeName,
} from './states'

const StyledIcons = styled.div<{ isAscend: boolean }>`
  transition: top 0.3s ease-out;
  position: relative;
  width: ${iconHeight};
  height: inherit;
  top: ${(props) => (props.isAscend ? '0' : '100%')};
`
const StyledIconWrapper = styled.div`
  position: absolute;
  transition: width 0.3s ease-out, height 0.3s ease-out;
`

const StyledIcon = styleIconWithColor(StyledIconWrapper)

const StyledAscendIcon = styled(StyledIcon)`
  top: 0;
`
const StyledDescendIcon = styled(StyledIcon)`
  top: -100%;
`
const sortTypeMap = {
  default: 'Default',
  domainName: 'Domain Name',
  port: 'Port',
  chain: 'Chain',
}

export type SortType = keyof typeof sortTypeMap
export function ToggleSorting({
  isAscend,
  setIsAscend,
}: {
  isAscend: boolean
  setIsAscend: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <Box overflow="hidden" height={iconHeight} style={{ flexShrink: 0 }}>
      <StyledIcons isAscend={isAscend}>
        <StyledDescendIcon>
          <Descend
            color="inherit"
            onClick={() => {
              setIsAscend(true)
            }}
          ></Descend>
        </StyledDescendIcon>
        <StyledAscendIcon>
          <Ascend
            color="inherit"
            onClick={() => {
              setIsAscend(false)
            }}
          ></Ascend>
        </StyledAscendIcon>
      </StyledIcons>
    </Box>
  )
}

export function SortTypeButton({
  usingSortType,
  sortType,
}: {
  usingSortType: SortType
  sortType: SortType
}) {
  const dispatch = useAppDispatch()
  const isActivated = useMemo(() => usingSortType === sortType, [
    usingSortType,
    sortType,
  ])
  const onClick = useCallback(() => {
    isActivated
      ? dispatch(setSortTypeName('default'))
      : dispatch(setSortTypeName(sortType))
  }, [dispatch, sortType, isActivated])

  return (
    <Button
      primary={isActivated}
      margin={{
        left: 'small',
        top: 'xsmall',
        bottom: 'xsmall',
      }}
      size="small"
      onClick={onClick}
      label={sortTypeMap[sortType]}
    ></Button>
  )
}

export default function Connections() {
  const dispatch = useAppDispatch()
  const connections = useAppSelector(selectConnections)
  const [isAscend, setIsAscend] = useState(true)
  const sortType = useAppSelector(selectUsingSortTypeName)
  const filterText = useAppSelector(selectUsingFilter)

  const setFilterText = useCallback(
    (filter: string) => {
      dispatch(setFilter([sortType, filter]))
    },
    [dispatch, sortType]
  )

  type Connection = typeof connections[number]
  type SortByType = typeof sortBy
  type SortByIteratees = Parameters<SortByType>[1]
  const sortedConnections = useMemo(() => {
    let sortByIteratees!: SortByIteratees
    let filterPredicate!: Parameters<typeof filter>[1]
    switch (sortType) {
      case 'domainName':
        sortByIteratees = ({ metadata: { host } }: Connection) => {
          const parseResult = parseDomain(host)
          if (parseResult.type === ParseResultType.Listed) {
            const { domain = '', subDomains = [] } = parseResult
            return domain + subDomains[0]
          }
          return host
        }
        filterPredicate = ({ metadata: { host = '' } }: Connection) =>
          host.includes(filterText)
        break
      case 'port':
        sortByIteratees = ({ metadata: { destinationPort } }: Connection) => {
          return destinationPort
        }
        filterPredicate = ({ metadata: { destinationPort } }: Connection) =>
          destinationPort.toString().includes(filterText)
        break
      case 'chain':
        sortByIteratees = [
          ({ chains }: Connection) => {
            return chains.slice(-1)[0]
          },
          ({ chains }: Connection) => {
            return chains.slice(-2)[0]
          },
          ({ chains }: Connection) => {
            return chains.slice(-3)[0]
          },
        ]
        filterPredicate = ({ chains }: Connection) =>
          chains.join().includes(filterText)
        break
    }
    const filteredConnections = filter(connections, filterPredicate)
    const sortResult = sortBy(
      filteredConnections,
      sortByIteratees
    ) as Connection[]
    return isAscend ? sortResult : [...sortResult].reverse()
  }, [connections, sortType, isAscend, filterText])
  const STButton = useMemo(
    () => ({ name }: { name: SortType }) => (
      <SortTypeButton usingSortType={sortType} sortType={name} />
    ),
    [sortType]
  )
  return (
    <Box fill>
      <Box align="center" direction="row" flex="grow">
        {sortType !== 'default' ? (
          <ToggleSorting
            isAscend={isAscend}
            setIsAscend={setIsAscend}
          ></ToggleSorting>
        ) : null}
        <Box direction="row" gap="small" wrap>
          <STButton name="domainName" />
          <STButton name="port" />
          <STButton name="chain" />
        </Box>
      </Box>
      {sortType !== 'default' ? (
        <Box flex="grow" direction="row" align="center">
          <Filter
            color={filterText.length === 0 ? colorLight6 : colorBrand}
          ></Filter>
          <Box
            margin={{
              top: 'small',
              bottom: 'small',
              left: 'medium',
            }}
            flex="grow"
          >
            <ControlledTextInput
              props={{
                type: 'text',
              }}
              controlledValue={filterText}
              onInput={setFilterText}
            ></ControlledTextInput>
          </Box>
        </Box>
      ) : null}
      <Box overflow="auto" flex="shrink">
        {sortedConnections?.map((connection, index) => {
          const {
            metadata: { host, destinationPort },
            chains,
          } = connection
          return (
            <Box key={index} flex="grow">
              <Text>{host + ':' + destinationPort.toString()}</Text>
              <Text size="small">{[...chains].reverse().join('>')}</Text>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
