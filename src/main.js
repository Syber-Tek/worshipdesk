import { app, BrowserWindow, ipcMain, screen, dialog } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import started from 'electron-squirrel-startup';
import {
  initDatabase,
  getStatusMessage,
  getBibles,
  getBooks,
  getVerses,
  searchVerses,
  getHymns,
  searchHymns,
  importHymnsBatch,
  importSqlFile,
  importTwiTxtFolder,
  importSngFile,
  importSngFolder
} from './db.js';

if (started) {
  app.quit();
}

let dbPath = '';
let mainWindow = null;
let presentationWindow = null;

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
ipcMain.handle('search-hymns', (_e, query) => searchHymns(query));

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

// Native Twi Bible Text Folder Import Handler
ipcMain.handle('import-twi-folder-dialog', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Select Twi Bible Folder (66 .txt files)',
    properties: ['openDirectory']
  });

  if (canceled || filePaths.length === 0) {
    return { success: false, message: 'Cancelled' };
  }

  const result = importTwiTxtFolder(filePaths[0]);
  if (result.success) {
    return { success: true, count: result.count, folderName: path.basename(filePaths[0]) };
  } else {
    return { success: false, message: result.error || result.message };
  }
});

// STAGE 5: PRESENTATION OUTPUT MULTI-WINDOW IPC FORWARDING
ipcMain.on('send-live-slide', (_event, slideData) => {
  if (presentationWindow && !presentationWindow.isDestroyed()) {
    presentationWindow.webContents.send('update-presentation-slide', slideData);
  }
});

const createPresentationWindow = () => {
  const allDisplays = screen.getAllDisplays();
  const secondaryDisplay = allDisplays.find((d) => d.id !== screen.getPrimaryDisplay().id);

  let windowBounds = {
    x: 100,
    y: 100,
    width: 1024,
    height: 768,
  };

  if (secondaryDisplay) {
    windowBounds = {
      x: secondaryDisplay.bounds.x,
      y: secondaryDisplay.bounds.y,
      width: secondaryDisplay.bounds.width,
      height: secondaryDisplay.bounds.height,
    };
  }

  presentationWindow = new BrowserWindow({
    x: windowBounds.x,
    y: windowBounds.y,
    width: windowBounds.width,
    height: windowBounds.height,
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

  const baseUrl = MAIN_WINDOW_VITE_DEV_SERVER_URL || `file://${path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)}`;
  const presentationUrl = `${baseUrl}?window=presentation`;

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    presentationWindow.loadURL(presentationUrl);
  } else {
    presentationWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`), { query: { window: 'presentation' } });
  }

  if (secondaryDisplay) {
    presentationWindow.setFullScreen(true);
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
  createPresentationWindow();

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
      createPresentationWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
