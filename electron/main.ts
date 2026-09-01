import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { autoUpdater } from 'electron-updater'

// Required on Windows so toast notifications show "Pomodoro" instead of a generic Electron name/icon.
app.setAppUserModelId('com.pomodoro.app')

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(process.env.VITE_PUBLIC || '', 'tomato.png'),
    backgroundColor: '#000000', // Premium dark background
    titleBarStyle: 'hidden', // Custom title bar for premium look
    titleBarOverlay: {
      color: '#000000',
      symbolColor: '#ffffff',
      height: 30
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // Test active push message to Console
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST || '../dist', 'index.html'))
  }
}

// Auto-update (production only): shortly after launch, checks the GitHub release
// feed, downloads any newer version in the background, and lets the user install
// it via the "restart now" button shown in the renderer.
function setupAutoUpdater() {
  if (!app.isPackaged) return

  autoUpdater.autoDownload = true

  autoUpdater.on('update-available', (info) => {
    win?.webContents.send('update-available', info.version)
  })

  autoUpdater.on('update-downloaded', (info) => {
    win?.webContents.send('update-downloaded', info.version)
  })

  autoUpdater.on('error', (err: Error) => {
    win?.webContents.send('update-error', err.message)
  })

  ipcMain.on('app:restart-to-install', () => {
    autoUpdater.quitAndInstall()
  })

  // Don't block startup; check a moment after the window is shown.
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch(() => {})
  }, 3000)
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  createWindow()
  setupAutoUpdater()
})
