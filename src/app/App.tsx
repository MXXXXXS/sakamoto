import { Box, Grid, Grommet, Tab, Tabs } from 'grommet'
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { Mask } from '../common/components/Mask'
import { theme } from '../common/style'
import Connections from '../features/connections'
import { getConnections } from '../features/connections/states'
import { Logs } from '../features/logs'
import { setLogLevel } from '../features/logs/states'
import PolicySwitcher from '../features/policySwitcher'
import ProfileManager from '../features/profileManager'
import { ProfileEditor } from '../features/profileManager/components/ProfileEditor'
import ProxyManager from '../features/proxyManager'
import Settings from '../features/settings'
import { StatusBar } from '../features/statusBar'
import { Info } from '../features/statusBar/components/Info'
import { useAppDispatch } from './hooks'

export default function App() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(setLogLevel('info')).catch((err) => console.error(err))
    dispatch(getConnections()).catch((err) => console.error(err))
  }, [dispatch])
  return (
    <Router>
      <Grommet theme={theme}>
        <Box align="center" height="100vh">
          <Grid
            style={{
              width: '100%',
              flex: 1,
              minHeight: 0,
            }}
            rows={['auto']}
            columns={['auto']}
            areas={[{ name: 'main', start: [0, 0], end: [0, 0] }]}
          >
            <Route path="/">
              <Box gridArea="main" pad="10px" fill>
                <Tabs alignSelf="stretch">
                  <Tab title="Settings">
                    <Settings />
                  </Tab>
                  <Tab title="Proxies">
                    <Box fill overflow="auto" pad="xsmall">
                      <ProxyManager />
                      <PolicySwitcher />
                    </Box>
                  </Tab>
                  <Tab title="Profiles">
                    <ProfileManager />
                  </Tab>
                  <Tab title="Logs">
                    <Logs></Logs>
                  </Tab>
                  <Tab title="Connections">
                    <Connections></Connections>
                  </Tab>
                </Tabs>
              </Box>
            </Route>
            <Mask>
              <Route path="/mask/info">
                <Info></Info>
              </Route>
              <Route path="/mask/profileEditor">
                <ProfileEditor></ProfileEditor>
              </Route>
            </Mask>
          </Grid>
          <StatusBar></StatusBar>
        </Box>
      </Grommet>
    </Router>
  )
}
