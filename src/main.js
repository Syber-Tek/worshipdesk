import { app, BrowserWindow, ipcMain, screen, dialog } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import started from 'electron-squirrel-startup';
import {
  initDatabase,
  getStatusMessage,
  getBibles,
  getBibleStats,
  getBooks,
  getVerses,
  searchVerses,
  getHymns,
  searchHymns,
  listHymns,
  getHymnLyrics,
  importHymnsBatch,
  importSqlFile,
  importXmlBibleFile,
  removeBible,
  rescanBiblesFolder,
  importSngFile,
  importSngFolder
} from './db.js';

if (started) {
  app.quit();
}

let dbPath = '';
let mainWindow = null;
const presentationWindows = new Map(); // displayId -> BrowserWindow

function getDisplayDetails() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const allDisplays = screen.getAllDisplays();

  return allDisplays.map((display, index) => ({
    id: display.id,
    label: display.label || `Display ${index + 1}`,
    isPrimary: display.id === primaryDisplay.id,
    width: display.bounds.width,
    height: display.bounds.height,
    bounds: display.bounds,
  }));
}

ipcMain.handle('get-app-info', () => {
  return {
    appName: 'Church Presenter',
    version: app.getVersion(),
    platform: process.platform,
    arch: process.arch,
    isOffline: true,
  };
});

ipcMain.handle('get-db-status', () => {
  const status = getStatusMessage();
  return {
    dbPath,
    message: status ? status.message : 'Database empty',
    createdAt: status ? status.created_at : null,
  };
});

ipcMain.handle('get-displays', () => {
  return getDisplayDetails();
});

// Bible IPC Handlers
ipcMain.handle('get-bibles', () => getBibles());
ipcMain.handle('get-books', (_e, bibleId) => getBooks(bibleId));
ipcMain.handle('get-verses', (_e, bookId, chapter) => getVerses(bookId, chapter));
ipcMain.handle('search-verses', (_e, query, bibleId) => searchVerses(query, bibleId));

// Hymns IPC Handlers
ipcMain.handle('get-hymns', () => getHymns());
ipcMain.handle('search-hymns', (_e, query, category) => searchHymns(query, category));
ipcMain.handle('list-hymns', (_e, query, category) => listHymns(query, category));
ipcMain.handle('get-hymn-lyrics', (_e, id) => getHymnLyrics(id));

// Native File Import Handler (.sng, .json, .txt)
ipcMain.handle('import-songs-dialog', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Import Church Songs & Hymns File (.sng, .json, .txt)',
    properties: ['openFile'],
    filters: [
      { name: 'Song Files', extensions: ['sng', 'json', 'txt'] }
    ]
  });

  if (canceled || filePaths.length === 0) {
    return { success: false, message: 'Cancelled' };
  }

  const selectedFile = filePaths[0];
  if (selectedFile.endsWith('.sng') || selectedFile.endsWith('.txt')) {
    const result = importSngFile(selectedFile);
    if (result.success) {
      return { success: true, count: 1, fileName: path.basename(selectedFile) };
    } else {
      return { success: false, message: result.error || result.message };
    }
  }

  try {
    const rawData = fs.readFileSync(selectedFile, 'utf-8');
    const parsedData = JSON.parse(rawData);
    const hymnList = Array.isArray(parsedData) ? parsedData : (parsedData.songs || parsedData.hymns || [parsedData]);
    const importedCount = importHymnsBatch(hymnList);
    return { success: true, count: importedCount, fileName: path.basename(selectedFile) };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

// Native Bible SQL Dump Import Handler
ipcMain.handle('import-bible-sql-dialog', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Import Bible SQL Dump File (.sql)',
    properties: ['openFile'],
    filters: [
      { name: 'SQL Files', extensions: ['sql'] }
    ]
  });

  if (canceled || filePaths.length === 0) {
    return { success: false, message: 'Cancelled' };
  }

  const result = importSqlFile(filePaths[0]);
  if (result.success) {
    return { success: true, fileName: path.basename(filePaths[0]) };
  } else {
    return { success: false, message: result.error || result.message };
  }
});

// Native Bible XML File Import Handler
ipcMain.handle('import-bible-xml-dialog', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Import Bible XML File (.xml)',
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Bible XML Files', extensions: ['xml'] }
    ]
  });

  if (canceled || filePaths.length === 0) {
    return { success: false, message: 'Cancelled' };
  }

  const results = [];
  for (const filePath of filePaths) {
    const result = importXmlBibleFile(filePath);
    results.push({
      success: result.success,
      fileName: path.basename(filePath),
      message: result.message || result.error || null
    });
  }
  return { success: true, results };
});

// Bible library management
ipcMain.handle('get-bible-stats', () => getBibleStats());

ipcMain.handle('remove-bible', (_e, bibleId) => removeBible(bibleId));

ipcMain.handle('rescan-bibles', () => rescanBiblesFolder());

// STAGE 5: PRESENTATION OUTPUT MULTI-WINDOW IPC FORWARDING
ipcMain.on('send-live-slide', (_event, slideData) => {
  for (const win of presentationWindows.values()) {
    if (win && !win.isDestroyed()) {
      win.webContents.send('update-presentation-slide', slideData);
    }
  }
});

// Deck navigation sent from any projector window (arrow keys) back to the control window.
ipcMain.on('deck-nav', (_event, dir) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('deck-nav', dir);
  }
});

// Open (or close) projector windows so the renderer can choose which displays are
// used for projection, including multiple displays at once.
ipcMain.handle('open-presentation-windows', (_event, displayIds) => {
  const ids = Array.isArray(displayIds) ? displayIds.map(Number).filter((n) => Number.isFinite(n)) : [];
  const activeDisplays = screen.getAllDisplays();

  for (const [id, win] of Array.from(presentationWindows.entries())) {
    if (!ids.includes(Number(id))) {
      if (win && !win.isDestroyed()) win.destroy();
      presentationWindows.delete(id);
    }
  }

  for (const id of ids) {
    const display = activeDisplays.find((d) => d.id === Number(id));
    if (display && !presentationWindows.has(String(id))) {
      createPresentationWindow(display);
    }
  }

  return { ok: true, active: Array.from(presentationWindows.keys()).map(Number) };
});

const createPresentationWindow = (display) => {
  const isPrimary = display.id === screen.getPrimaryDisplay().id;
  const bounds = display.bounds;

  const win = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    fullscreen: !isPrimary,
    title: 'Church Presenter - Live Projector Output',
    autoHideMenuBar: true,
    backgroundColor: '#000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  });

  presentationWindows.set(String(display.id), win);
  win.on('closed', () => {
    presentationWindows.delete(String(display.id));
  });

  const baseUrl = MAIN_WINDOW_VITE_DEV_SERVER_URL || `file://${path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)}`;
  const presentationUrl = `${baseUrl}?window=presentation`;

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    win.loadURL(presentationUrl);
  } else {
    win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`), { query: { window: 'presentation' } });
  }
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Church Presenter - Control Window',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
};

app.whenReady().then(() => {
  dbPath = initDatabase();
  createWindow();

  const notifyDisplayChange = () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('displays-changed', getDisplayDetails());
    }
  };

  screen.on('display-added', notifyDisplayChange);
  screen.on('display-removed', notifyDisplayChange);
  screen.on('display-metrics-changed', notifyDisplayChange);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
