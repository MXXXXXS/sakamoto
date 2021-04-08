import { Box, Button, Select } from 'grommet'
import React, { useMemo } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../app/hooks'
import {
  changeProxy,
  selectPolicySelected,
  selectUsingPolicies,
  setPolicySelected,
} from '../policySwitcher/states/policiesSlice'
import { mapTo, ProxyNode } from '../proxyManager/components/ProxyNode'
import { selectProxyNodes } from '../proxyManager/states/proxiesSlice'

export default function PolicySwitcher() {
  const dispatch = useDispatch()
  const usingPolicies = useAppSelector(selectUsingPolicies)
  const proxyNodes = useAppSelector(selectProxyNodes)
  const policySelected = useAppSelector(selectPolicySelected)

  const usingPolicy = useMemo(() => {
    const policy = usingPolicies.find(
      (rulePolicy) => rulePolicy.name === policySelected
    )
    if (policy) {
      const policyProxyNodeWithLatencies = policy.proxies.map(
        (policyProxyNodeName) => {
          const result = proxyNodes.find(
            (proxyNode) => policyProxyNodeName === proxyNode.name
          )
          return result
            ? result
            : ({
                name: policyProxyNodeName,
                type: '',
                latency: [policyProxyNodeName, -1],
              } as ProxyNode)
        }
      )

      return {
        ...policy,
        proxies: policyProxyNodeWithLatencies,
      }
    }
  }, [policySelected, usingPolicies, proxyNodes])

  return (
    <Box
      align="stretch"
      flex={{
        shrink: 3,
      }}
    >
      {/* <Grid columns={['xsmall', 'auto']} rows="small" align="center"> */}
      <Select
        options={usingPolicies.map((policy) => policy.name)}
        placeholder="Select and modify policies"
        value={policySelected}
        onChange={({ value }) => {
          dispatch(setPolicySelected(value))
        }}
      ></Select>
      {usingPolicy ? (
        <Box overflow="auto">
          {[...usingPolicy.proxies]
            .sort((a, b) => a.latency[1] - b.latency[1])
            .map((proxy) => {
              const { name, latency } = proxy
              return (
                <Button
                  margin={{
                    top: 'xsmall',
                    left: 'small',
                    right: 'small',
                  }}
                  key={proxy.name}
                  label={name}
                  color={mapTo('latency', latency).color}
                  primary={name === usingPolicy.using}
                  onClick={() => {
                    dispatch(
                      changeProxy({
                        proxy: proxy.name,
                        policy: policySelected,
                      })
                    )
                  }}
                ></Button>
              )
            })}
        </Box>
      ) : (
        ''
      )}
      {/* </Grid> */}
    </Box>
  )
}
