// electron/main.ts
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '../public/logo.ico'), // Add this line
    webPreferences: {
      nodeIntegration: false,        // ✅ Disabled for security
      contextIsolation: true,         // ✅ Enabled for security
      sandbox: true,                 // ✅ Enabled for security
      preload: path.join(__dirname, 'preload.ts'), // ✅ Preload script
    }
  });

  // Load app
  if (isDev) {
    win.loadURL('http://localhost:5173'); // Vite dev server (port 5173)
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html')); // Vite production build
  }
}

app.whenReady().then(() => {
  createWindow();

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