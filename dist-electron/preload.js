import { contextBridge, ipcRenderer } from 'electron';
// Expose ONLY these specific functions to your React app
contextBridge.exposeInMainWorld('electronAPI', {
    // Safe: read files
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
    // Safe: save files
    saveFile: (filePath, content) => ipcRenderer.invoke('save-file', filePath, content),
    // Safe: get app version
    getVersion: () => ipcRenderer.invoke('get-version'),
    // NOT exposing dangerous things like:
    // - Direct file system access
    // - Shell execution
    // - Full IPC access
});
