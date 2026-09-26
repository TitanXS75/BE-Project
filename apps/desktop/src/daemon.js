const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

let backendProcess = null;

/**
 * Checks if an HTTP endpoint responds with a 200-series status.
 */
function checkEndpoint(url, timeoutMs = 1500) {
  return new Promise((resolve) => {
    try {
      const req = http.get(url, { timeout: timeoutMs }, (res) => {
        resolve(res.statusCode >= 200 && res.statusCode < 400);
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
    } catch {
      resolve(false);
    }
  });
}

/**
 * Finds available Python executable on the system or local virtualenv.
 */
function getPythonExecutable(projectRoot) {
  const venvPaths = [
    path.join(projectRoot, '.venv', 'Scripts', 'python.exe'),
    path.join(projectRoot, 'venv', 'Scripts', 'python.exe'),
    path.join(projectRoot, '.venv', 'bin', 'python'),
    path.join(projectRoot, 'venv', 'bin', 'python'),
  ];

  for (const vPath of venvPaths) {
    if (fs.existsSync(vPath)) {
      return vPath;
    }
  }

  return process.platform === 'win32' ? 'python' : 'python3';
}

/**
 * Ensures the FastAPI local backend is running. Spawns it if not running.
 */
async function ensureBackendRunning(projectRoot) {
  const healthUrl = 'http://127.0.0.1:8000/api/v1/health';
  const isRunning = await checkEndpoint(healthUrl);

  if (isRunning) {
    console.log('[Daemon] FastAPI backend is already active on port 8000.');
    return { status: 'already_running', url: 'http://127.0.0.1:8000' };
  }

  console.log('[Daemon] Spawning local FastAPI backend process...');
  const pythonExe = getPythonExecutable(projectRoot);
  const appDir = path.join(projectRoot, 'apps', 'local-api');

  try {
    backendProcess = spawn(
      pythonExe,
      ['-m', 'uvicorn', 'app.main:app', '--app-dir', 'app', '--port', '8000', '--host', '127.0.0.1'],
      {
        cwd: appDir,
        detached: false,
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
          ...process.env,
          PYTHONUNBUFFERED: '1',
          AXIOM_AIR_GAPPED: '1',
        },
      }
    );

    backendProcess.stdout?.on('data', (data) => {
      console.log(`[FastAPI stdout] ${data.toString().trim()}`);
    });

    backendProcess.stderr?.on('data', (data) => {
      console.error(`[FastAPI stderr] ${data.toString().trim()}`);
    });

    backendProcess.on('exit', (code, signal) => {
      console.log(`[Daemon] FastAPI process exited with code ${code}, signal ${signal}`);
      backendProcess = null;
    });

    // Wait for backend to be healthy (up to 15 seconds)
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 500));
      const active = await checkEndpoint(healthUrl);
      if (active) {
        console.log('[Daemon] FastAPI backend successfully initialized and healthy.');
        return { status: 'spawned', url: 'http://127.0.0.1:8000' };
      }
    }

    console.warn('[Daemon] FastAPI did not report healthy in 15 seconds, but process is running.');
    return { status: 'starting', url: 'http://127.0.0.1:8000' };
  } catch (err) {
    console.error('[Daemon] Failed to spawn FastAPI backend:', err);
    return { status: 'error', error: err.message };
  }
}

/**
 * Locates the Ollama executable on the system.
 */
function findOllamaExecutable() {
  if (process.platform === 'win32') {
    const localAppData = process.env.LOCALAPPDATA || '';
    const progFiles = process.env.ProgramFiles || '';
    const progFilesX86 = process.env['ProgramFiles(x86)'] || '';
    const userProfile = process.env.USERPROFILE || '';

    const candidates = [
      path.join(localAppData, 'Programs', 'Ollama', 'ollama.exe'),
      path.join(progFiles, 'Ollama', 'ollama.exe'),
      path.join(progFilesX86, 'Ollama', 'ollama.exe'),
      path.join(userProfile, 'AppData', 'Local', 'Programs', 'Ollama', 'ollama.exe'),
      'C:\\Program Files\\Ollama\\ollama.exe',
    ];

    for (const c of candidates) {
      if (fs.existsSync(c)) return c;
    }
  } else {
    const candidates = [
      '/usr/local/bin/ollama',
      '/usr/bin/ollama',
      '/opt/homebrew/bin/ollama',
    ];
    for (const c of candidates) {
      if (fs.existsSync(c)) return c;
    }
  }
  return null;
}

/**
 * Checks local Ollama status, availability, and installed models.
 */
async function checkOllamaStatus() {
  const ollamaUrl = 'http://127.0.0.1:11434/api/version';
  const isOnline = await checkEndpoint(ollamaUrl, 1200);
  const execPath = findOllamaExecutable();
  const isInstalled = execPath !== null || isOnline;

  let version = null;
  let modelsCount = 0;

  if (isOnline) {
    try {
      const verData = await new Promise((resolve) => {
        http.get('http://127.0.0.1:11434/api/version', (res) => {
          let body = '';
          res.on('data', (c) => (body += c));
          res.on('end', () => {
            try {
              resolve(JSON.parse(body));
            } catch {
              resolve(null);
            }
          });
        }).on('error', () => resolve(null));
      });
      if (verData) version = verData.version;
    } catch {
      // Ignored
    }
  }

  return {
    online: isOnline,
    running: isOnline,
    installed: isInstalled,
    status: isOnline ? 'running' : isInstalled ? 'installed_not_running' : 'not_installed',
    version,
    executablePath: execPath,
    url: 'http://127.0.0.1:11434',
  };
}

/**
 * Launches local Ollama daemon if installed.
 */
async function startOllamaDaemon() {
  const status = await checkOllamaStatus();
  if (status.online) return { success: true, message: 'Already running' };

  const execPath = status.executablePath || 'ollama';
  try {
    const child = spawn(execPath, ['serve'], {
      detached: true,
      windowsHide: true,
      stdio: 'ignore',
    });
    child.unref();

    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 500));
      const active = await checkEndpoint('http://127.0.0.1:11434/api/version', 800);
      if (active) return { success: true, message: 'Ollama started' };
    }
    return { success: false, message: 'Ollama process started but not responding yet' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Gracefully shuts down spawned backend processes.
 */
function stopDaemons() {
  if (backendProcess) {
    console.log('[Daemon] Stopping spawned FastAPI backend...');
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', backendProcess.pid.toString(), '/f', '/t']);
      } else {
        backendProcess.kill('SIGTERM');
      }
    } catch (e) {
      console.error('[Daemon] Error terminating backend process:', e);
    }
    backendProcess = null;
  }
}

module.exports = {
  ensureBackendRunning,
  checkOllamaStatus,
  startOllamaDaemon,
  findOllamaExecutable,
  checkEndpoint,
  stopDaemons,
};
