const { remote, ipcRenderer } = require('electron')

const path = require('path')
const WebGLRender = require(path.join(__dirname, './WebglRender.js'))

const cux_render = new WebGLRender()
cux_render.initGLfromCanvas(document.getElementById("SyncMainVideo"))

// 监听主进程返回的消息
ipcRenderer.on('videodata', function (event, arg) {
  try {
    cux_render.draw(arg.data, arg.width, arg.height)  
  } catch (error) {
    console.log("draw video data error: ", error)
  }
  
})
