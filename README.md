# zego-electron-quick-start app运行

1. 安装好node环境。
2. 安装好npm环境。
3. 按照以下命令执行。

## 进入`zego-electron-quick-start`目录
```
$ cd zego-electron-quick-start
```

## 配置npm淘宝镜像，安装依赖
```
$ npm config set registry http://registry.npm.taobao.org/
$ npm install
```

## 修改填写`renderer.js`的第10行的 app_id 和 sign_key。
```
// app id，在zego 控制台https://console.zego.im/acount 注册后，获取app id，ID为整形或者字符串均可
const app_id = ; 
// app key，是一个数组，格式例如 [0x01, 0x03, 0x44, ....]
const sign_key = [];
```

## 运行测试程序
```
$ npm start
```

## 打包发布测试程序
```
mac 平台打包，不使用签名时使用以下命令禁止
$ export CSC_IDENTITY_AUTO_DISCOVERY=false
```
```
$ npm run pkg
```

## 执行成功后，`dist`目录下生成

* 安装包文件：
`zego-electron-quick-start Setup 1.0.0.exe`

* 未打成安装包的可执行文件目录：
`win-ia32-unpacked`

# 要在自己项目中集成zego sdk的步骤

- 安装zego sdk
```
$ npm install zegoliveroom
```
- 引入zego sdk
```
var ZegoLiveRoom = require("zegoliveroom/ZegoLiveRoom.js");
```
- 创建zego client
```
var zegoClient = new ZegoLiveRoom();
```

## 由于网络原因，可以参考如下NPM配置相关：

+ 设成淘宝的
```
npm config set registry http://registry.npm.taobao.org/
```
+ 换成原来的
```
npm config set registry https://registry.npmjs.org/
```
+ 设置代理
```
npm config set proxy http://127.0.0.1:1080
npm config set https-proxy http://127.0.0.1:1080
```
+ 删除代理
```
npm config delete proxy
npm config delete https-proxy
```
