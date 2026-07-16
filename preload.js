const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveToLocalPC: (dataString) => ipcRenderer.send('save-database', dataString)
});