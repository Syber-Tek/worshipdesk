import { contextBridge, ipcRenderer } from 'electron'

// Securely expose specific IPC channels to the React Renderer
contextBridge.exposeInMainWorld('api', {
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  getDbStatus: () => ipcRenderer.invoke('get-db-status'),
  getDisplays: () => ipcRenderer.invoke('get-displays'),
  setAppTheme: (themeMode) => ipcRenderer.invoke('set-app-theme', themeMode),
  getAppTheme: () => ipcRenderer.invoke('get-app-theme'),
  onNativeThemeChanged: (callback) => {
    const subscription = (_event, payload) => callback(payload)
    ipcRenderer.on('native-theme-changed', subscription)
    return () => ipcRenderer.removeListener('native-theme-changed', subscription)
  },
  openPresentationWindows: (displayIds) => ipcRenderer.invoke('open-presentation-windows', displayIds),
  openStageWindow: () => ipcRenderer.invoke('open-stage-window'),
  closeStageWindow: () => ipcRenderer.invoke('close-stage-window'),
  toggleStageWindow: () => ipcRenderer.invoke('toggle-stage-window'),
  getStageWindowStatus: () => ipcRenderer.invoke('get-stage-window-status'),
  onStageStatusChanged: (callback) => {
    const subscription = (_event, active) => callback(active)
    ipcRenderer.on('stage-window-status-changed', subscription)
    return () => ipcRenderer.removeListener('stage-window-status-changed', subscription)
  },
  onDisplaysChanged: (callback) => {
    const subscription = (_event, displays) => callback(displays)
    ipcRenderer.on('displays-changed', subscription)
    return () => ipcRenderer.removeListener('displays-changed', subscription)
  },
  // Bible API Methods
  getBibles: () => ipcRenderer.invoke('get-bibles'),
  getBibleStats: () => ipcRenderer.invoke('get-bible-stats'),
  getBooks: (bibleId) => ipcRenderer.invoke('get-books', bibleId),
  getVerses: (bookId, chapter) => ipcRenderer.invoke('get-verses', bookId, chapter),
  searchVerses: (query, bibleId) => ipcRenderer.invoke('search-verses', query, bibleId),
  removeBible: (bibleId) => ipcRenderer.invoke('remove-bible', bibleId),
  rescanBibles: () => ipcRenderer.invoke('rescan-bibles'),
  backupDatabase: () => ipcRenderer.invoke('backup-database'),
  savePlanFile: (planData) => ipcRenderer.invoke('save-plan-file', planData),
  openPlanFile: () => ipcRenderer.invoke('open-plan-file'),
  notifyNative: (payload) => ipcRenderer.send('native-notification', payload),
  setPresentationFullscreen: (fullscreen) =>
    ipcRenderer.invoke('set-presentation-fullscreen', Boolean(fullscreen)),

  setLoginItem: (openAtLogin) =>
    ipcRenderer.invoke('set-login-item-open-at-login', { openAtLogin: Boolean(openAtLogin) }),
  getLoginItem: () => ipcRenderer.invoke('get-login-item-open-at-login'),
  // Hymn API Methods
  getHymns: () => ipcRenderer.invoke('get-hymns'),
  getHymnsCount: () => ipcRenderer.invoke('get-hymns-count'),
  getHymnCategories: () => ipcRenderer.invoke('get-hymn-categories'),
  searchHymns: (query, category) => ipcRenderer.invoke('search-hymns', query, category),
  listHymns: (query, category) => ipcRenderer.invoke('list-hymns', query, category),
  getHymnLyrics: (id) => ipcRenderer.invoke('get-hymn-lyrics', id),
  // Import Dialogs
  importSongsDialog: () => ipcRenderer.invoke('import-songs-dialog'),
  importBibleSql: () => ipcRenderer.invoke('import-bible-sql-dialog'),
  importBibleXml: () => ipcRenderer.invoke('import-bible-xml-dialog'),
  // STAGE 5: PRESENTATION OUTPUT MULTI-WINDOW IPC
  sendLiveSlide: (slideData) => ipcRenderer.send('send-live-slide', slideData),
  onPresentationUpdate: (callback) => {
    const subscription = (_event, data) => callback(data)
    ipcRenderer.on('update-presentation-slide', subscription)
    return () => ipcRenderer.removeListener('update-presentation-slide', subscription)
  },
  // Projector -> Control deck navigation (arrow keys on the projector screen)
  sendDeckNav: (dir) => ipcRenderer.send('deck-nav', dir),
  onDeckNav: (callback) => {
    const subscription = (_event, dir) => callback(dir)
    ipcRenderer.on('deck-nav', subscription)
    return () => ipcRenderer.removeListener('deck-nav', subscription)
  }
})
