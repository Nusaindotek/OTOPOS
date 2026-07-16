const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        fullscreen: false, // Ubah ke true jika ingin kasir langsung full satu layar penuh
        autoHideMenuBar: true, // Sembunyikan menu bar browser bawaan agar terlihat seperti aplikasi kasir premium
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js') // Jembatan aman untuk save data lokal PC
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

// Menulis database otomatis ke Harddisk PC Kasir agar tidak bergantung pada history browser
ipcMain.on('save-database', (event, dataString) => {
    const backupFolder = path.join(app.getPath('userData'), 'OtoPOS_Data');
    
    if (!fs.existsSync(backupFolder)){
        fs.mkdirSync(backupFolder, { recursive: true });
    }
    
    const filePath = path.join(backupFolder, 'database_backup.json');
    fs.writeFileSync(filePath, dataString, 'utf-8');
    console.log("Auto-Save file aman di lokal PC:", filePath);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});