import { contextBridge, ipcRenderer } from 'electron'

// Securely expose specific IPC channels to the React Renderer
contextBridge.exposeInMainWorld('api', {
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  getDbStatus: () => ipcRenderer.invoke('get-db-status'),
  getDisplays: () => ipcRenderer.invoke('get-displays'),
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
  // Hymn API Methods
  getHymns: () => ipcRenderer.invoke('get-hymns'),
  searchHymns: (query) => ipcRenderer.invoke('search-hymns', query),
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
  }
})
