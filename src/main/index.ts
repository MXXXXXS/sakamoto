import * as chokidar from 'chokidar'
import { app, BrowserWindow } from 'electron'
import { resolve } from 'path'

import { registIpcHandlers, subconverterLogs } from '../ipc'
import { startClashAndSubconverter } from '../utils/childProcessManagement'

startClashAndSubconverter().catch((err) => console.error(err))

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    minHeight: 500,
    minWidth: 360,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  })

  mainWindow.webContents.openDevTools()

  return mainWindow
}

let timer: NodeJS.Timeout

// app生命周期
app
  .whenReady()
  .then(async () => {
    const mainWindow = createWindow()
    const webContents = mainWindow.webContents

    registIpcHandlers()

    if (ISDEV) {
      const session = webContents.session
      await session
        .loadExtension(
          resolve(__dirname, '../../chromeExtensions/react_4.10.1_0'),
          { allowFileAccess: true }
        )
        .catch((err) => console.error(err))

      await session
        .loadExtension(
          resolve(__dirname, '../../chromeExtensions/redux_2.17.0_0'),
          {
            allowFileAccess: true,
          }
        )
        .catch((err) => console.error(err))

      chokidar.watch('app').on('all', () => {
        webContents
          .loadFile('app/index.html')
          .catch((err) => console.error(err))
      })
    } else {
      webContents.loadFile('app/index.html').catch((err) => console.error(err))
    }

    timer = setInterval(() => {
      subconverterLogs(webContents)
    }, 2000)
  })
  .catch((err) => console.error(err))

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    clearInterval(timer)
    app.quit()
  }
})

// app.on('activate', () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     const mainWindow = createWindow()

//     compiler.watch(
//       {
//         aggregateTimeout: 400,
//         // poll: 1000,
//         ignored: '**/node_modules',
//       },
//       (err, stats) => {
//         if (err || stats?.hasErrors()) {
//           console.error(err)
//         }

//         mainWindow.loadFile('app/index.html').catch((err) => console.error(err))
//       }
//     )
//   }
// })
