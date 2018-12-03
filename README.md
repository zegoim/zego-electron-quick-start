# zego-electron-quick-start 

1. 安装好node 32位环境。[https://nodejs.org/dist/v10.14.1/node-v10.14.1-x86.msi](https://nodejs.org/dist/v10.14.1/node-v10.14.1-x86.msi)
2. 按照以下命令执行。

## 执行以下命令，下载工程源码
```
git clone https://github.com/zegoim/zego-electron-quick-start.git
```

## 进入`zego-electron-quick-start`目录
```
$ cd zego-electron-quick-start
```

## 配置npm淘宝镜像，安装依赖
```
$ npm config set registry http://registry.npm.taobao.org/
$ npm install
```
## 由于网络原因，可能导致npm install安装依赖时失败，需要来回切换npm的淘宝镜像和国外镜像

+ 执行以下命令，设置npm淘宝镜像
```
npm config set registry http://registry.npm.taobao.org/
// 删除http代理
npm config delete proxy
// 删除https代理
npm config delete https-proxy
```

+ 执行以下命令，设置国外镜像，并通过代理访问国外镜像
```
npm config set registry https://registry.npmjs.org/
// 设置代理
npm config set proxy http://127.0.0.1:1080
// 设置https代理
npm config set https-proxy http://127.0.0.1:1080
```

<div STYLE="page-break-after: always;"></div>

## 修改填写`renderer.js`的第10行的 app_id 和 sign_key。
```
// app id，
// 在zego 控制台https://console.zego.im/acount 
// 注册后，获取app id，ID为整形或者字符串均可
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

<div STYLE="page-break-after: always;"></div>

# 要在自己项目中集成zego sdk的步骤

1. 安装zego sdk
```
$ npm install zegoliveroom
```
2. 在工程项目中的renderer.js文件中添加以下代码，引入zego sdk，[参考代码 | _blank](https://github.com/zegoim/zego-electron-quick-start//blob/master/renderer.js#L5)
```
var ZegoLiveRoom = require("zegoliveroom/ZegoLiveRoom.js");
var ZEGOCONSTANTS = require("zegoliveroom/ZegoConstant.js");
```
3. 创建zego client，[参考代码 | _blank](https://github.com/zegoim/zego-electron-quick-start//blob/master/renderer.js#L14)
```
var zegoClient = new ZegoLiveRoom();
```
4. 配置当前环境，[参考代码 | _blank](https://github.com/zegoim/zego-electron-quick-start//blob/master/renderer.js#L63)
```
  // 配置设置当前环境为测试环境
  zegoClient.setUseEnv({ use_test_env: true });
```
5. 初始化sdk，[参考代码 | _blank](https://github.com/zegoim/zego-electron-quick-start//blob/master/renderer.js#L66)
```
  // 初始化sdk
  let ret = zegoClient.initSDK({
    app_id: app_id,           // appid
    sign_key: sign_key,       // app key
    user_id: TEST_USER_ID,    // 用户id
    user_name: TEST_USER_NAME // 用户名字
  }, rs => {
    if (rs.error_code == 0) {
      console.log("sdk初始化成功");
    } else {
      console.log("sdk初始化失败,错误码为：" + rs.error_code);
      zegoClient.unInitSDK();
    }
  });
  if (ret) {
    console.log("正在初始化...");
  } else {
    console.log("sdk初始化失败");
    zegoClient.unInitSDK();
  }
```
6. 登录房间，[参考代码 | _blank](https://github.com/zegoim/zego-electron-quick-start//blob/master/renderer.js#L91)
```
  // 登陆房间
  let ret = zegoClient.loginRoom({
    room_id: TEST_ROOM_ID,                    // 房间id
    room_name: TEST_ROOM_NAME,                // 房间名字
    role: ZEGOCONSTANTS.ZegoRoomRole.Audience // 房间角色
  }, rs => {
    console.log("登录结果返回 ", rs);
    if (rs.error_code == 0) {
      console.log("登录成功");
    } else {
      console.log("登录失败，错误码为：" + rs.error_code);
    }
  });
```

7. 预览摄像头，[参考代码 | _blank](https://github.com/zegoim/zego-electron-quick-start//blob/master/renderer.js#L121)
```
  // 设置预览view
  let set_ret = zegoClient.setPreviewView({
    // 设置canvas
    canvas_view: document.getElementById("localVideo"),
    // 通道索引，默认主通道
    channel_index: ZEGOCONSTANTS.PublishChannelIndex.PUBLISH_CHN_MAIN
  });
  if (set_ret) {
    // 开始预览 
    let preview_ret = zegoClient.startPreview({
      channel_index: ZEGOCONSTANTS.PublishChannelIndex.PUBLISH_CHN_MAIN
    });
    console.log("预览结果", preview_ret);
  }
```

8. 开启回音消除、噪音消除和增益，[参考代码 | _blank](https://github.com/zegoim/zego-electron-quick-start//blob/master/renderer.js#L132)

```
    // 开启回音消除
    zegoClient.enableAEC({enable:true});
    // 开启噪音消除
    zegoClient.enableANS({enable:true});
    // 开启增益
    zegoClient.enableAGC({enable:true});
```

<div STYLE="page-break-after: always;"></div>

9. 开始推流，发送音视频数据，[参考代码 | _blank](https://github.com/zegoim/zego-electron-quick-start//blob/master/renderer.js#L144)
```
  // 开始推流
  let ret = zegoClient.startPublishing({
    title: "zego electron simple test xx",// 推流标题
    stream_id: TEST_PUB_STREAM_ID,// 推流id
    // 推流flag，连麦、混流还是单主播
    publish_flag: ZEGOCONSTANTS.ZegoPublishFlag.ZEGO_JOIN_PUBLISH, 
    params: ""// 推流参数
  });
```

10. 开始拉流，播放音视频数据，[参考代码 | _blank](https://github.com/zegoim/zego-electron-quick-start//blob/master/renderer.js#L156)
```
 // 开始拉流播放
  zegoClient.startPlayingStream({
   stream_id: TEST_PLAY_STREAM_ID,                      // 拉流id
   canvas_view: document.getElementById("remoteVideo"), // 设置播放的canvas
   params: ""                                           // 拉流参数
  });
```

11. 开始录制，[参考代码 | _blank](https://github.com/zegoim/zego-electron-quick-start//blob/master/renderer.js#L169)
```
  // 录制分辨率设定
  let width = 1920;  // 宽
  let height = 1080; // 高
  
  // 设置录制输出分辨率
  zegoClient.setRecordOutput({
      width:width,  // 宽
      height:height // 高
  });
  
  // 添加录制本地视频
  zegoClient.addRecordSource({
      source_type:ZEGOCONSTANTS.RecordSourceType.LocalVideo,
            pos_x:0,       // 本地视频起始位置x
            pos_y:0,       // 本地视频起始位置y
            width:width/2, // 本地视频宽
           height:height});// 本地视频高

  // 添加录制对端视频
  zegoClient.addRecordSource({
              source_type:ZEGOCONSTANTS.RecordSourceType.RemoteVideo,
                    pos_x:width/2,  // 对端视频起始位置x
                    pos_y:0,        // 对端视频起始位置y
                    width:width/2,  // 对端视频宽
                   height:height}); // 对端视频高
  
  // 开始录制
  zegoClient.startRecord({
    savefile:"d:/record.mp4" // 录制文件路径
    }, rs=>{
        if(rs.error_code == 0){
            console.log("正在录制..");
        }else{
            console.log("录制发生错误，错误码为:" + rs.error_code);
        }
    });
```

12. 停止录制，[参考代码 | _blank](https://github.com/zegoim/zego-electron-quick-start//blob/master/renderer.js#L210)
```
  // 停止录制 
  zegoClient.stopRecord()
```

13. 停止拉流，[参考代码 | _blank](https://github.com/zegoim/zego-electron-quick-start//blob/master/renderer.js#L164)
```
  zegoClient.stopPlayingStream({ 
    stream_id: TEST_PLAY_STREAM_ID  // 流id
  });
```

14. 停止推流，[参考代码 | _blank](https://github.com/zegoim/zego-electron-quick-start//blob/master/renderer.js#L214)
```
  zegoClient.stopPublishing({
       // 通道
       channel_index: ZEGOCONSTANTS.PublishChannelIndex.PUBLISH_CHN_MAIN 
  });
```
15. 退出房间，[参考代码 | _blank](https://github.com/zegoim/zego-electron-quick-start//blob/master/renderer.js#L219)
```
  zegoClient.logoutRoom(rs => { });
```

16. 反初始化sdk，[参考代码 | _blank](https://github.com/zegoim/zego-electron-quick-start//blob/master/renderer.js#L224)
```
  zegoClient.unInitSDK();
```

<div STYLE="page-break-after: always;"></div>

17. 更多的功能接口和触发通知事件，请查阅工程demo示例和api接口文档。


## 工程运行后，界面如下

![工程运行后的界面](demo.bmp)

