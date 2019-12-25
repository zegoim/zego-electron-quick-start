// Modules to control application life and create native browser window

const { app, BrowserWindow } = require('electron')

const zego_crasher_report_helper = require('./crash_report_helper')

// 崩溃后要提交到的服务器配置
// 一、服务器使用 mini-breakpad-server 的配置示例
// 自己搭建可以参考：https://github.com/electron/mini-breakpad-server
var post_protocol = 'http:'
var post_host = '127.0.0.1'
var post_port = '1127'
var post_path = '/post'

// 二、服务器使用 bugsplat 的配置示例
// 使用bugsplat示例，由于是压缩文件，在bugsplat上不能识别和解析，需要下载minidumpBp.dmp并改后缀名为zip解压
// post_host 请修改为自己DatabaseName的host地址
//var post_protocol = 'http:'
//var post_host = 'zegotest.bugsplat.com'
//var post_port = '80'
//var post_path = '/post/bp/crash/postBP.php'        

// 调用本函数，当崩溃时会生成dmp文件
zego_crasher_report_helper.genDmpFileIfCrashed();

// Electron 生成dmp文件的位置为：tmp 目录/产品目录 Crashes/ 
var dmp_file_dir = app.getPath("temp") + "/" + app.getName() + " Crashes"

if (process.platform == 'darwin') {
    dmp_file_dir = app.getPath("temp") + app.getName() + "\ Crashes" + "/pending/"
}

// 查找zego sdk日志文件, 与调用setLogDir设置的日志目录位置要一致,否则找不到zego sdk的日志
var zego_log_dir = dmp_file_dir

// 指定打包dmp文件和日志文件的临时压缩文件
var tmp_zip_file_path = zego_log_dir + "/log.zip"

// 程序启动时，先会搜索dmp文件，如果指定目录下有dmp文件就会打包dmp文件和日志文件并且上传
// 上传成功后才会删除
zego_crasher_report_helper.searchDmpFileAndUpload(
{
    dmp_file_dir: dmp_file_dir,
    zego_log_dir: zego_log_dir,
    tmp_zip_path: tmp_zip_file_path,
    upload_server: {
        protocol: post_protocol,
        host: post_host,
        port: post_port,
        path: post_path
    }
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 800, height: 600, webPreferences: { nodeIntegration: true } })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    // 添加崩溃监听
    // 在这里收集崩溃文件和日志文件，并把崩溃文件和日志文件上传到服务器
    mainWindow.webContents.on('crashed', function () {
        //console.log("crashed event...",dmp_file_dir);
        // 监听到崩溃时搜索dmp文件和zego sdk日志文件并上传
        zego_crasher_report_helper.searchDmpFileAndUpload(
        {
            dmp_file_dir: dmp_file_dir,
            zego_log_dir: zego_log_dir,
            tmp_zip_path: tmp_zip_file_path,
            upload_server: {
                protocol: post_protocol,
                host: post_host,
                port: post_port,
                path: post_path
            }
        })
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



