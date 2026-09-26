# 🖥️ Axiom Desktop Container (Electron)

This directory contains the production Electron desktop application container for Axiom, providing native offline OS integration, automated daemon orchestration, and `.rssh` file associations.

## 🚀 Key Features
- **Native `.rssh` File Associations**: Double-clicking any `.rssh` course bundle in Windows File Explorer or macOS Finder launches Axiom and mounts the syllabus package instantly into the active workspace.
- **Background Daemon Orchestration**: Electron automatically detects and quietly launches the local FastAPI backend (`http://127.0.0.1:8000`) and monitors local Ollama instances (`http://127.0.0.1:11434`) without showing detached command prompt windows.
- **Secure Context Isolation**: Uses modern Electron security architecture (`contextIsolation: true`, `nodeIntegration: false`, typed IPC bridge in `preload.js`).
- **Apple Dark Glassmorphism UI**: Seamless frameless or auto-hidden menu bar integrating directly with the Vite React 19 frontend.
- **Single Instance Control**: Focuses the active window and pipes newly opened files via IPC when launched multiple times.

## 📦 Scripts
- `npm run start` - Launch desktop shell with production defaults.
- `npm run dev` - Launch desktop shell in development mode (connecting to Vite on `http://127.0.0.1:7575`).
- `npm run pack` - Package unpacked desktop binaries.
- `npm run dist` - Build production installer (`nsis` and `zip` for Windows x64).
