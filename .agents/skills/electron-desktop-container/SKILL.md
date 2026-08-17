---
name: electron-desktop-container
description: Electron desktop application patterns, native OS file associations for .rssh bundles, offline IPC channels, and Windows x64 installer builds.
---

# Electron Desktop Container & Native Packaging

## When to Use This Skill
Load this skill ONLY when building, packaging, or configuring the desktop app in `apps/desktop` or native installer scripts.

---

## 1. Native File Association Configuration (`package.json`)
```json
{
  "build": {
    "appId": "ai.axiom.desktop",
    "productName": "Axiom",
    "win": {
      "target": ["nsis", "zip"],
      "icon": "assets/icon.ico",
      "fileAssociations": [
        {
          "ext": "rssh",
          "name": "Axiom Subject Package",
          "description": "Axiom Relational Syllabus Subject Hub Archive",
          "icon": "assets/rssh-file.ico",
          "role": "Editor"
        }
      ]
    }
  }
}
```

---

## 2. Secure Offline IPC Communication
- **Context Isolation**: Always enable `contextIsolation: true` and `nodeIntegration: false` in `BrowserWindow` webPreferences.
- **File Double-Click Handler**:
```javascript
// main.js
app.on('open-file', (event, filePath) => {
  if (filePath.endsWith('.rssh')) {
    mainWindow.webContents.send('mount-rssh-package', filePath);
  }
});
```

---

## 3. Local Daemon Management
- The Electron main process checks if local FastAPI/Ollama instances are running. If not running, it launches bundled background child processes quietly without opening detached terminal windows.
