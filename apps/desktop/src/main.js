const { app, BrowserWindow, ipcMain, dialog, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const daemon = require('./daemon');

const isDev = process.argv.includes('--dev') || process.env.NODE_ENV === 'development';
const projectRoot = path.resolve(__dirname, '..', '..');

let mainWindow = null;
let pendingRSSHFile = null;

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  console.log('[Axiom Desktop] Another instance is already running. Quitting duplicate.');
  app.quit();
} else {
  app.on('second-instance', (_event, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();

      // Check if second instance was invoked with a .rssh file
      const rsshArg = commandLine.find((arg) => typeof arg === 'string' && arg.toLowerCase().endsWith('.rssh'));
      if (rsshArg && fs.existsSync(rsshArg)) {
        handleRSSHFile(rsshArg);
      }
    }
  });
}

function handleRSSHFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return;
  console.log('[Axiom Desktop] Mounting .rssh package:', filePath);

  if (mainWindow && mainWindow.webContents && !mainWindow.webContents.isLoading()) {
    try {
      const stats = fs.statSync(filePath);
      const fileName = path.basename(filePath);
      mainWindow.webContents.send('mount-rssh-package', {
        filePath,
        fileName,
        sizeBytes: stats.size,
      });
    } catch (e) {
      console.error('[Axiom Desktop] Error reading .rssh file stats:', e);
    }
  } else {
    pendingRSSHFile = filePath;
  }
}

// macOS open-file event
app.on('open-file', (event, filePath) => {
  event.preventDefault();
  if (filePath.toLowerCase().endsWith('.rssh')) {
    handleRSSHFile(filePath);
  }
});

// Parse initial command line arguments for .rssh file on Windows/Linux
const initialRSSHArg = process.argv.find((arg) => typeof arg === 'string' && arg.toLowerCase().endsWith('.rssh'));
if (initialRSSHArg && fs.existsSync(initialRSSHArg)) {
  pendingRSSHFile = initialRSSHArg;
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 680,
    backgroundColor: '#000000',
    title: 'Axiom — Air-Gapped Curriculum Platform',
    icon: path.join(__dirname, '..', 'assets', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    autoHideMenuBar: true,
  });

  Menu.setApplicationMenu(null);

  // Initialize local FastAPI & Ollama daemons
  daemon.ensureBackendRunning(projectRoot).then((backendStatus) => {
    daemon.checkOllamaStatus().then((ollamaStatus) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('daemon-status', {
          backend: backendStatus,
          ollama: ollamaStatus,
        });
      }
    });
  });

  // Determine renderer URL
  const devUrl = 'http://127.0.0.1:7575';
  const fallbackUrl = 'http://127.0.0.1:8000';

  if (isDev) {
    try {
      await mainWindow.loadURL(devUrl);
    } catch (err) {
      console.warn(`[Axiom Desktop] Could not connect to dev server at ${devUrl}, loading local API root.`);
      await mainWindow.loadURL(fallbackUrl).catch(() => {});
    }
  } else {
    // In production, try loading devUrl or local packaged server
    const isDevServerRunning = await daemon.checkEndpoint(devUrl, 800);
    if (isDevServerRunning) {
      await mainWindow.loadURL(devUrl);
    } else {
      await mainWindow.loadURL(devUrl).catch(async () => {
        await mainWindow.loadURL(fallbackUrl).catch(() => {});
      });
    }
  }

  mainWindow.webContents.on('did-finish-load', () => {
    if (pendingRSSHFile) {
      handleRSSHFile(pendingRSSHFile);
      pendingRSSHFile = null;
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Setup IPC handlers
ipcMain.on('window:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window:maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window:close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window:is-maximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

ipcMain.handle('rssh:select-file', async () => {
  if (!mainWindow) return { canceled: true };
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Axiom Subject Package (.rssh)',
    filters: [
      { name: 'Axiom Subject Package (*.rssh)', extensions: ['rssh'] },
      { name: 'All Files (*.*)', extensions: ['*'] },
    ],
    properties: ['openFile'],
  });

  if (result.canceled || !result.filePaths.length) {
    return { canceled: true };
  }

  const selectedPath = result.filePaths[0];
  const stats = fs.statSync(selectedPath);
  return {
    canceled: false,
    filePath: selectedPath,
    fileName: path.basename(selectedPath),
    sizeBytes: stats.size,
  };
});

ipcMain.handle('daemon:get-status', async () => {
  const backendHealthy = await daemon.checkEndpoint('http://127.0.0.1:8000/api/v1/health', 1000);
  const ollamaStatus = await daemon.checkOllamaStatus();
  return {
    backend: {
      url: 'http://127.0.0.1:8000',
      online: backendHealthy,
    },
    ollama: ollamaStatus,
  };
});

ipcMain.handle('shell:open-external', async (_event, url) => {
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    await shell.openExternal(url);
    return true;
  }
  return false;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  daemon.stopDaemons();
});
