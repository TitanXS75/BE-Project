const { contextBridge, ipcRenderer } = require('electron');

const desktopBridge = {
  isElectron: true,
  platform: process.platform,

  /**
   * Subscribes to OS .rssh file open events (e.g. double-click in Explorer).
   */
  onMountRSSHPackage: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on('mount-rssh-package', handler);
    return () => {
      ipcRenderer.removeListener('mount-rssh-package', handler);
    };
  },

  /**
   * Subscribes to daemon status updates from main process.
   */
  onDaemonStatus: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on('daemon-status', handler);
    return () => {
      ipcRenderer.removeListener('daemon-status', handler);
    };
  },

  /**
   * Opens a native file dialog to select a .rssh subject package file.
   */
  selectRSSHFile: () => ipcRenderer.invoke('rssh:select-file'),

  /**
   * Window management controls.
   */
  windowControls: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:is-maximized'),
  },

  /**
   * Queries daemon health status from the main process.
   */
  getDaemonStatus: () => ipcRenderer.invoke('daemon:get-status'),

  /**
   * Opens external URL safely in default browser.
   */
  openExternal: (url) => ipcRenderer.invoke('shell:open-external', url),
};

// Expose on both axiomDesktop and electronAPI for maximum integration flexibility
contextBridge.exposeInMainWorld('axiomDesktop', desktopBridge);
contextBridge.exposeInMainWorld('electronAPI', desktopBridge);
