import { app, BrowserWindow } from 'electron';
import path from 'path';

let mainWindow;

function createWindow() {
    // Configuramos la ventana de Windows/Mac
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "GameDex",
        autoHideMenuBar: true, // Oculta el menú clásico de "Archivo, Editar, Ver..."
        webPreferences: {
            nodeIntegration: true,
        }
    });

    // Le decimos a Electron que cargue el servidor de desarrollo de Vite
    mainWindow.loadURL('http://localhost:5173');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Cuando Electron esté listo, abre la ventana
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
}); 