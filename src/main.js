import { app, Menu, BrowserWindow, ipcMain, screen, dialog, Notification, nativeImage } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
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
  importSngFolder,
  getHymnsCount,
  getHymnCategories
} from './db.js';

let dbPath = '';
let mainWindow = null;
let stageWindow = null;
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
    appName: 'WorshipDesk',
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
ipcMain.handle('get-hymns-count', () => getHymnsCount());
ipcMain.handle('get-hymn-categories', () => getHymnCategories());
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

ipcMain.handle('backup-database', async () => {
  try {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Backup WorshipDesk Database',
      defaultPath: `church-presenter-backup-${new Date().toISOString().slice(0, 10)}.db`,
      filters: [{ name: 'SQLite Database', extensions: ['db'] }],
    });
    if (canceled || !filePath) return { success: false, message: 'Cancelled' };
    await fs.promises.copyFile(dbPath, filePath);
    return { success: true, message: filePath };
  } catch (err) {
    return { success: false, message: String((err && err.message) || err) };
  }
});

// Save Service Plan File (*.worship / *.json)
ipcMain.handle('save-plan-file', async (_e, planData) => {
  try {
    const defaultName = `WorshipPlan-${new Date().toISOString().slice(0, 10)}.worship`;
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Save WorshipDesk Service Plan',
      defaultPath: defaultName,
      filters: [
        { name: 'WorshipDesk Plan (*.worship)', extensions: ['worship'] },
        { name: 'JSON Plan (*.json)', extensions: ['json'] },
      ],
    });
    if (canceled || !filePath) return { success: false, message: 'Cancelled' };
    await fs.promises.writeFile(filePath, JSON.stringify(planData, null, 2), 'utf-8');
    return { success: true, filePath, fileName: path.basename(filePath) };
  } catch (err) {
    return { success: false, message: String((err && err.message) || err) };
  }
});

// Open Service Plan File (*.worship / *.json)
ipcMain.handle('open-plan-file', async () => {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Open WorshipDesk Service Plan File',
      properties: ['openFile'],
      filters: [
        { name: 'WorshipDesk Plan (*.worship, *.json)', extensions: ['worship', 'json'] },
      ],
    });
    if (canceled || filePaths.length === 0) return { success: false, message: 'Cancelled' };
    const filePath = filePaths[0];
    const raw = await fs.promises.readFile(filePath, 'utf-8');
    const plan = JSON.parse(raw);
    return { success: true, filePath, fileName: path.basename(filePath), plan };
  } catch (err) {
    return { success: false, message: String((err && err.message) || err) };
  }
});

// Native OS notification (Windows toast / tray balloon) fired from the renderer.
ipcMain.on('native-notification', (_event, { title, body } = {}) => {
  if (!Notification.isSupported()) return;
  const notification = new Notification({ title: title || 'WorshipDesk', body: body || '' });
  notification.show();
});

// Persist launch-on-system-startup via native login-item (Windows Taskbar
// startup folder / macOS launch agent / Linux .desktop autostart).
ipcMain.handle('set-login-item-open-at-login', (_event, { openAtLogin } = {}) => {
  try {
    app.setLoginItemSettings({ openAtLogin: Boolean(openAtLogin) });
    return { success: true, openAtLogin: Boolean(openAtLogin) };
  } catch (err) {
    return { success: false, error: String((err && err.message) || err) };
  }
});
ipcMain.handle('get-login-item-open-at-login', () => {
  try {
    const s = app.getLoginItemSettings();
    return { success: true, openAtLogin: Boolean(s && s.openAtLogin) };
  } catch (err) {
    return { success: false, error: String((err && err.message) || err) };
  }
});

// Autostart the app when the OS session boots (Windows Startup folder via
// app.setLoginItemSettings / macOS login items injected from the renderer).
ipcMain.handle('set-login-item', (_event, { enabled } = {}) => {
  try {
    app.setLoginItemSettings({
      openAtLogin: Boolean(enabled),
      path: process.execPath,
      args: ['--hidden']
    });
    return { success: true, openAtLogin: Boolean(enabled) };
  } catch (err) {
    return { success: false, error: String((err && err.message) || err) };
  }
});

// Current persisted login-item (startup) state so the General settings toggle
// can render the real value instead of a dead defaultChecked switch.
ipcMain.handle('get-login-item', () => {
  try {
    const s = app.getLoginItemSettings();
    return { success: true, openAtLogin: Boolean(s && s.openAtLogin) };
  } catch (err) {
    return { success: false, error: String((err && err.message) || err) };
  }
});

// Fullscreen (or restore) — routed to every open presentation/projector window.
// Handler (Promise) so the renderer gets a real window count back for toasts.
const setPresentationFullscreen = (fullscreen) => {
  const isFull = Boolean(fullscreen);
  let affected = 0;
  for (const win of presentationWindows.values()) {
    if (win && !win.isDestroyed()) {
      win.setFullScreen(isFull);
      affected++;
    }
  }
  return { success: true, windows: affected };
};

ipcMain.handle('set-presentation-fullscreen', () => setPresentationFullscreen(true));

ipcMain.handle('set-presentation-fullscreen-off', () => setPresentationFullscreen(false));


// STAGE 5: PRESENTATION OUTPUT MULTI-WINDOW IPC FORWARDING
ipcMain.on('send-live-slide', (_event, slideData) => {
  for (const win of presentationWindows.values()) {
    if (win && !win.isDestroyed()) {
      win.webContents.send('update-presentation-slide', slideData);
    }
  }
  if (stageWindow && !stageWindow.isDestroyed()) {
    stageWindow.webContents.send('update-presentation-slide', slideData);
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

function notifyStageStatusChange() {
  const active = Boolean(stageWindow && !stageWindow.isDestroyed());
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('stage-window-status-changed', active);
  }
}

const createStageWindow = () => {
  if (stageWindow && !stageWindow.isDestroyed()) {
    stageWindow.focus();
    notifyStageStatusChange();
    return;
  }

  const appIcon = getAppIcon();
  const displays = screen.getAllDisplays();
  const targetDisplay = displays.length > 1 ? displays[1] : displays[0];
  const bounds = targetDisplay.bounds;

  stageWindow = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    title: 'WorshipDesk - Stage Display / Confidence Monitor',
    icon: appIcon,
    autoHideMenuBar: true,
    backgroundColor: '#0C0D0E',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  });

  if (appIcon && !appIcon.isEmpty()) {
    stageWindow.setIcon(appIcon);
  }

  stageWindow.on('closed', () => {
    stageWindow = null;
    notifyStageStatusChange();
  });

  const baseUrl = process.env.ELECTRON_RENDERER_URL || `file://${path.join(__dirname, '../renderer/index.html')}`;
  const stageUrl = `${baseUrl}?window=stage`;

  if (process.env.ELECTRON_RENDERER_URL) {
    stageWindow.loadURL(stageUrl);
  } else {
    stageWindow.loadFile(path.join(__dirname, '../renderer/index.html'), { query: { window: 'stage' } });
  }

  notifyStageStatusChange();
};

const closeStageWindow = () => {
  if (stageWindow && !stageWindow.isDestroyed()) {
    stageWindow.destroy();
    stageWindow = null;
  }
  notifyStageStatusChange();
};

ipcMain.handle('open-stage-window', () => {
  createStageWindow();
  return { success: true, active: true };
});

ipcMain.handle('close-stage-window', () => {
  closeStageWindow();
  return { success: true, active: false };
});

ipcMain.handle('toggle-stage-window', () => {
  if (stageWindow && !stageWindow.isDestroyed()) {
    closeStageWindow();
    return { success: true, active: false };
  } else {
    createStageWindow();
    return { success: true, active: true };
  }
});

ipcMain.handle('get-stage-window-status', () => {
  return { active: Boolean(stageWindow && !stageWindow.isDestroyed()) };
});

function getAppIcon(themeMode = 'dark') {
  const primaryIcon = themeMode === 'light' ? 'app-icon-dark.png' : 'app-icon-light.png';
  const fallbackIcon = themeMode === 'light' ? 'app-icon-light.png' : 'app-icon-dark.png';
  const candidates = [
    path.join(process.cwd(), `src/assets/${primaryIcon}`),
    path.join(process.cwd(), `src/assets/${fallbackIcon}`),
    path.join(__dirname, `assets/${primaryIcon}`),
    path.join(app.getAppPath(), `src/assets/${primaryIcon}`),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      const img = nativeImage.createFromPath(p);
      if (!img.isEmpty()) return img;
    }
  }
  return undefined;
}

ipcMain.handle('set-window-icon', (_e, themeMode) => {
  const icon = getAppIcon(themeMode);
  if (icon && !icon.isEmpty()) {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setIcon(icon);
    }
    for (const win of presentationWindows.values()) {
      if (win && !win.isDestroyed()) {
        win.setIcon(icon);
      }
    }
    if (stageWindow && !stageWindow.isDestroyed()) {
      stageWindow.setIcon(icon);
    }
  }
  return { success: true };
});

const createPresentationWindow = (display) => {
  const isPrimary = display.id === screen.getPrimaryDisplay().id;
  const bounds = display.bounds;
  const appIcon = getAppIcon();

  const win = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    fullscreen: !isPrimary,
    title: 'WorshipDesk - Live Projector Output',
    icon: appIcon,
    autoHideMenuBar: true,
    backgroundColor: '#000000',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  });

  if (appIcon && !appIcon.isEmpty()) {
    win.setIcon(appIcon);
  }

  presentationWindows.set(String(display.id), win);
  win.on('closed', () => {
    presentationWindows.delete(String(display.id));
  });

  const baseUrl = process.env.ELECTRON_RENDERER_URL || `file://${path.join(__dirname, '../renderer/index.html')}`;
  const presentationUrl = `${baseUrl}?window=presentation`;

  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(presentationUrl);
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'), { query: { window: 'presentation' } });
  }
};

const createWindow = () => {
  const appIcon = getAppIcon();
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'WorshipDesk - Control Window',
    icon: appIcon,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  });

  if (appIcon && !appIcon.isEmpty()) {
    mainWindow.setIcon(appIcon);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    for (const win of presentationWindows.values()) {
      if (win && !win.isDestroyed()) {
        win.destroy();
      }
    }
    presentationWindows.clear();
    if (stageWindow && !stageWindow.isDestroyed()) {
      stageWindow.destroy();
      stageWindow = null;
    }
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
};

app.whenReady().then(() => {
  // Remove the File/Edit/View menu bar in production builds only.
  // Keep it while running via `npm run dev` so DevTools shortcuts & defaults
  // stay available during development.
  if (app.isPackaged) {
    Menu.setApplicationMenu(null);
  }

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
