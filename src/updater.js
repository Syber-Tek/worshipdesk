import { app, ipcMain, shell } from 'electron'
import { autoUpdater } from 'electron-updater'

// Where users get new builds by hand. The macOS builds are not code-signed, so
// an in-app install cannot replace the app bundle there and the user has to
// download it instead.
const RELEASES_URL = 'https://github.com/Syber-Tek/worshipdesk-releases/releases/latest'

let mainWindow = null
let wired = false

const send = (payload) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater-status', payload)
  }
}

// An unsigned macOS build cannot be replaced in place, so we surface the manual
// download instead of letting the install fail with a signing error.
const isUnsignedMac = () => process.platform === 'darwin' && !app.isSigned

export function initUpdater(win) {
  mainWindow = win

  if (wired) return
  wired = true

  ipcMain.handle('check-for-updates', () => {
    if (!app.isPackaged) {
      return { ok: false, message: 'Updates are only available in an installed copy of WorshipDesk.' }
    }
    try {
      // Report the outcome through the 'updater-status' channel.
      autoUpdater.checkForUpdates().catch(() => {})
      return { ok: true }
    } catch (err) {
      return { ok: false, message: err.message }
    }
  })

  ipcMain.handle('download-update', () => {
    if (!app.isPackaged) return { ok: false, message: 'Not an installed copy.' }
    try {
      autoUpdater.downloadUpdate().catch(() => {})
      return { ok: true }
    } catch (err) {
      return { ok: false, message: err.message }
    }
  })

  ipcMain.handle('install-update', () => {
    if (!app.isPackaged) return { ok: false, message: 'Not an installed copy.' }
    try {
      // isSilent = false, isForceRunAfter = true
      autoUpdater.quitAndInstall(false, true)
      return { ok: true }
    } catch (err) {
      return { ok: false, message: err.message }
    }
  })

  ipcMain.handle('open-releases-page', async () => {
    await shell.openExternal(RELEASES_URL)
    return { ok: true }
  })

  // Nothing to update from a dev run or an --dir unpackaged build, so leave the
  // listeners off rather than letting them spam errors.
  if (!app.isPackaged) return

  // The user decides when to download, and quitting after a download applies it,
  // so an update is never installed behind someone's back mid-service.
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('checking-for-update', () => send({ status: 'checking' }))

  autoUpdater.on('update-available', (info) => {
    send({
      status: 'available',
      version: info.version,
      releaseDate: info.releaseDate ?? null,
      manualOnly: isUnsignedMac(),
      releasesUrl: RELEASES_URL,
    })
  })

  autoUpdater.on('update-not-available', (info) => {
    send({ status: 'up-to-date', version: info?.version ?? app.getVersion() })
  })

  autoUpdater.on('download-progress', (progress) => {
    send({
      status: 'downloading',
      percent: Math.round(progress.percent ?? 0),
      transferred: progress.transferred ?? 0,
      total: progress.total ?? 0,
      bytesPerSecond: progress.bytesPerSecond ?? 0,
    })
  })

  autoUpdater.on('update-downloaded', (info) => {
    send({ status: 'downloaded', version: info?.version ?? null, manualOnly: isUnsignedMac() })
  })

  autoUpdater.on('error', (err) => {
    send({ status: 'error', message: err?.message ?? String(err) })
  })
}
