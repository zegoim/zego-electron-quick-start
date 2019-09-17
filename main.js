// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let auxWindow

function createWindow () {
  // Create the main browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})


  // Create the aux browser window.
  auxWindow = new BrowserWindow({x:0, y:0, width: 800, height: 600})

  // define global data so mainwindow can get the id of the auxwindow,
  // ipcRenderer.sendTo(webContentsId, channel, [, arg1][, arg2][, ...])
  global["auxWindowId"] = auxWindow.id


  // and load the index.html of the app.
  mainWindow.loadFile('indexofmain.html')
  // and load the index.html of the app.
  auxWindow.loadFile('indexofaux.html')
  
  // Open the DevTools.
  mainWindow.webContents.openDevTools()
  // Open the DevTools.
  auxWindow.webContents.openDevTools()


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  // Emitted when the window is closed.
  auxWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    auxWindow = null
  })


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.