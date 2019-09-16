// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// 引入zego sdk
var ZegoLiveRoom = require("zegoliveroom/ZegoLiveRoom.js");
var ZEGOCONSTANTS = require("zegoliveroom/ZegoConstant.js");

// app id
const app_id = "";//向zego获取app id，ID为字符串
// app key
const sign_key = [];//向zego获取测试sign key，是一个数组，格式例如 [0x01, 0x03, 0x44, ....]

// 创建zego client
var zegoClient = new ZegoLiveRoom();

const getVersionButton = document.getElementById("getVersion");
const initButton = document.getElementById("init");
const loginButton = document.getElementById("login");
const selectVideoDeviceButton = document.getElementById("selectVideoDevice");
const previewButton = document.getElementById("preview");
const publishStreamButton = document.getElementById("publishStream");
const playStreamButton = document.getElementById("playStream");
const stopPlayButton = document.getElementById("stopPlay");
const startRecordButton = document.getElementById("startRecord");
const stopRecordButton = document.getElementById("stopRecord");
const stopPublishButton = document.getElementById("stopPublish");
const logoutRoomButton = document.getElementById("logoutRoom");
const uninitSdkButton = document.getElementById("uninitSdk");
const sendMediaSideInfoButton = document.getElementById("sendMediaSideInfo");

// gen randow word
function randomWord(len) {
  let str = "",
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  for (let i = 0; i < len; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}

// 用户id
const TEST_USER_ID = "test_user_id" + randomWord(5);
// 用户名字
const TEST_USER_NAME = "test_user_name" + randomWord(5);
// 房间id
const TEST_ROOM_ID = "test_room_id" + randomWord(5);
// 房间名字
const TEST_ROOM_NAME="test_room_name" + randomWord(5);
// 推流的流id
const TEST_PUB_STREAM_ID = "test_stram_id" + randomWord(5);
// 拉流的流id
const TEST_PLAY_STREAM_ID = TEST_PUB_STREAM_ID;

// 获取版本号
getVersionButton.onclick = () => {
  document.getElementById("sdkversiontext").innerText = zegoClient.getSDKVersion();
}

// 初始化sdk
initButton.onclick = () => {
  
  // 配置设置当前环境为测试环境
  zegoClient.setUseEnv({ use_test_env: true });
  
  // 初始化sdk
  let ret = zegoClient.initSDK({
    app_id: app_id,
    sign_key: sign_key,
    user_id: TEST_USER_ID,
    user_name: TEST_USER_NAME
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
}

// 登录
loginButton.onclick = () => {
  // 登陆房间
  let ret = zegoClient.loginRoom({
    room_id: TEST_ROOM_ID,
    room_name: TEST_ROOM_NAME,
    role: ZEGOCONSTANTS.ZegoRoomRole.Audience
  }, rs => {
    console.log("登录结果返回 ", rs);
    if (rs.error_code == 0) {
      console.log("登录成功");
    } else {
      console.log("登录失败，错误码为：" + rs.error_code);
    }
  });
}

// 选择摄像头设备
selectVideoDeviceButton.onclick = () => {
  // 获取摄像头设备列表
  let video_devices_list = zegoClient.getVideoDeviceList();
  console.log("got video devices list:", video_devices_list);
  if(video_devices_list.length > 0){
    let cur_sel_index = 0; // 设备索引，选择第一个设备
    zegoClient.setVideoDevice({
      device_id: video_devices_list[cur_sel_index].device_id 
    });
  }
}

// 预览本地摄像头
previewButton.onclick = () => {
  // 预览视频
  let set_ret = zegoClient.setPreviewView({
    canvas_view: document.getElementById("localVideo"),
    channel_index: ZEGOCONSTANTS.PublishChannelIndex.PUBLISH_CHN_MAIN
  });
  if (set_ret) {
    let preview_ret = zegoClient.startPreview({
      channel_index: ZEGOCONSTANTS.PublishChannelIndex.PUBLISH_CHN_MAIN
    });
    console.log("预览结果", preview_ret);
    
    // 开启回音消除
    zegoClient.enableAEC({enable:true});
    
    // 开启噪音消除
    zegoClient.enableANS({enable:true});
    
    // 开启增益
    zegoClient.enableAGC({enable:true});    
    
  }
}

// 开始推流
publishStreamButton.onclick = () => {
  // 开始推流
  let ret = zegoClient.startPublishing({
    title: "zego electron simple test xx",
    stream_id: TEST_PUB_STREAM_ID,
    publish_flag: ZEGOCONSTANTS.ZegoPublishFlag.ZEGO_JOIN_PUBLISH,
    params: ""
  });
}

// 开始拉流播放
playStreamButton.onclick = () => {
  zegoClient.startPlayingStream({
    stream_id: TEST_PLAY_STREAM_ID,
    canvas_view: document.getElementById("remoteVideo"),
    params: ""
  });
}

// 停止拉流
stopPlayButton.onclick = () => {
  zegoClient.stopPlayingStream({ stream_id: TEST_PLAY_STREAM_ID });
}

// 停止推流
stopPublishButton.onclick = () => {
  zegoClient.stopPublishing({ channel_index: ZEGOCONSTANTS.PublishChannelIndex.PUBLISH_CHN_MAIN });
}

// 退出房间
logoutRoomButton.onclick = () => {
  zegoClient.logoutRoom(rs => { });
}

// 反初始化sdk
uninitSdkButton.onclick = () => {
  zegoClient.unInitSDK();
}

sendMediaSideInfoButton.onclick = () => {
    zegoClient.activateMediaSideInfo({});
    zegoClient.sendMediaSideInfo({side_info:"test side info message"});
    
}


// SDK 引擎事件通知
zegoClient.onEventHandler("onAVKitEvent", rs => {
  console.log("SDK 引擎事件通知，onAVKitEvent, rs = ", rs);
  // EventType:
  // {
  //     Play_BeginRetry: 1,        /**< 开始重试拉流 */
  //     Play_RetrySuccess: 2,      /**< 重试拉流成功 */
  //     Publish_BeginRetry: 3,     /**< 开始重试推流 */
  //     Publish_RetrySuccess: 4,   /**< 重试推流成功 */
  //     Play_TempDisconnected: 5,     /**< 拉流临时中断 */
  //     Publish_TempDisconnected: 6,  /**< 推流临时中断 */
  //     Play_VideoBreak: 7,           /**< 拉流卡顿(视频) */
  // }
});


// 拉流状态通知
zegoClient.onEventHandler("onPlayStateUpdate", rs => {
  console.log("拉流状态通知，onPlayStateUpdate, rs = ", rs);
  if (rs.error_code == 0) {
    console.log("拉流成功, 流id=" + rs.stream_id);
  } else {
    // 错误码
    //  = 0        拉流成功
    //  = 3        直播遇到严重错误。stateCode = 1/2 基本不会出现|请检查：1、客户端网络是否正常(从CDN拉客户端解析拉流域名失败);2、超过拉流路数(默认同时支持12路)范围限制。
    //  = 5        获取流信息失败| 基本不会出现
    //  = 6        流不存在。|请检查：1.环境是否相同(推流端和拉流端的appid和正式或测试环境是否一致);2、拉流的streamid是否已推流成功。
    //  = 7        媒体服务器连接失败。|1、推流端是否推流成功；2、环境是否相同(推流端和拉流端的appid和正式或测试环境是否一致)；3.网络是否正常。
    //  = 9        未 loginRoom 就直接调用startPlayingStream。|请检查：推流前是否已调用loginRoom。
    //  = 197612   拉的流不存在|请检查：拉流的streamid是否已推流成功。
    //  = 197619   禁止拉流|请检查：是否已调用后台禁止推流接口禁止此streamid推流。
    //  = 262145   拉流被拒绝|请检查：streamid是否已推流
    console.log('拉流失败,错误码为' + rs.error_code);
  }
});

// 拉流质量更新事件通知
zegoClient.onEventHandler("onPlayQualityUpdate", rs => {
  console.log("拉流质量更新事件通知，onPlayQualityUpdate, rs = ", rs);
});


// 推流状态更新返回
zegoClient.onEventHandler("onPublishStateUpdate", rs => {
  console.log("推流状态更新返回，onPublishStateUpdate, rs = ", rs);
  if (rs.error_code == 0) {
    console.log("推流成功, 流id=" + rs.stream_id);
  } else {
    // 错误码
    //  = 0        推流成功
    //  = 4        创建直播流失败。|请检查：1、userId\userName是否为空;2、streamid是否已存在；3、是否有开启测试环境(未配置正式环境的情况下)；4、appid\appkey是否正确。
    //  = 7        媒体服务器连接失败。|请检查：客户端网络是否正常。
    //  = 8        DNS 解析失败。|请检查：1、客户端网络是否正常(从CDN拉客户端解析拉流域名失败);
    console.log('推流失败,错误码为' + rs.error_code);
  }
});

// 流更新事件通知
zegoClient.onEventHandler("onStreamUpdated", rs => {
  console.log("流更新事件通知， onStreamUpdated, rs = ", rs);
  // add stream
  if (rs.stream_update_type == ZEGOCONSTANTS.ZegoStreamUpdateType.StreamAdded) {
    console.log("添加视频流，流列表为:", rs.stream_list)
  } else if (rs.stream_update_type == ZEGOCONSTANTS.ZegoStreamUpdateType.StreamDeleted) {
    // remove stream
    console.log("移除了视频流，流列表为:", rs.stream_list);
  }
});

// 推流质量通知
zegoClient.onEventHandler("onPublishQualityUpdate", rs => { console.log("推流质量通知，onPublishQualityUpdate, rs = ", rs); });
// 房间用户更新
zegoClient.onEventHandler("onUserUpdate", rs => { console.log("房间用户更新，onUserUpdate, rs = ", rs); });
// 房间在线人数更新
zegoClient.onEventHandler("onUpdateOnlineCount", rs => { console.log("在线人数更新，onUpdateOnlineCount, rs = ", rs); });
// 发送房间消息结果返回
zegoClient.onEventHandler("onSendRoomMessage", rs => { console.log("发送房间消息结果返回，onSendRoomMessage, rs = ", rs); });
// 收到房间消息通知
zegoClient.onEventHandler("onRecvRoomMessage", rs => { console.log("收到房间消息通知，onRecvRoomMessage, rs = ", rs); });
// 发送大房间消息结果返回
zegoClient.onEventHandler("onSendBigRoomMessage", rs => { console.log("发送大房间消息结果返回，onSendBigRoomMessage, rs = ", rs); });
// 收到大房间消息通知
zegoClient.onEventHandler("onRecvBigRoomMessage", rs => { console.log("收到大房间消息通知，onRecvBigRoomMessage, rs = ", rs); });
// 发送自定义消息结果返回
zegoClient.onEventHandler("onCustomCommand", rs => { console.log("发送自定义消息结果返回，onCustomCommand, rs = ", rs); });
// 收到自定义消息通知
zegoClient.onEventHandler("onRecvCustomCommand", rs => { console.log("收到自定义消息通知，onRecvCustomCommand, rs = ", rs); });
// 流额外信息更新通知
zegoClient.onEventHandler("onStreamExtraInfoUpdated", rs => { console.log("流额外信息更新通知，onStreamExtraInfoUpdated, rs = ", rs); });
// 音频设备状态更新通知
zegoClient.onEventHandler("onAudioDeviceStateChanged", rs => { console.log("音频设备状态更新通知，onAudioDeviceStateChanged, rs = ", rs); });
// 视频设备状态更新通知
zegoClient.onEventHandler("onVideoDeviceStateChanged", rs => { console.log("视频设备状态更新通知，onVideoDeviceStateChanged, rs = ", rs); });
// 音量变更事件通知
zegoClient.onEventHandler("onAudioVolumeChanged", rs => { console.log("音量变更事件通知，onAudioVolumeChanged, rs = ", rs); });
// 设备状态错误事件通知
zegoClient.onEventHandler("onDeviceError", rs => { console.log("设备状态错误事件通知，onDeviceError, rs = ", rs); });
// 被挤掉线通知
zegoClient.onEventHandler("onKickOut", rs => {console.log("被挤掉线通知，onKickOut, rs = ", rs);});
// 已从房间断开连接
zegoClient.onEventHandler("onDisconnect", rs => { console.log("已从房间断开连接,onDisconnect, rs = ", rs);});
// 与 server 重连成功通知
zegoClient.onEventHandler("onReconnect", rs => { console.log("与 server 重连成功通知，onReconnect, rs = ", rs); });
// 临时中断通知
zegoClient.onEventHandler("onTempBroken", rs => { console.log("临时中断通知，onTempBroken, rs = ", rs); });
// 引擎结束停止通知
zegoClient.onEventHandler("onAVEngineStop", () => { console.log("引擎结束停止通知，onAVEngineStop"); });
// 录制状态回调
zegoClient.onEventHandler("onRecordStatusUpdate", rs => {
  console.log("录制状态回调，onRecordStatusUpdate, rs = ", rs);
});
// 收到媒体次要信息回调
zegoClient.onEventHandler("onRecvMediaSideInfo", rs => {console.log("收到媒体次要信息", rs);})


const { remote, ipcRenderer } = require('electron')

// 收到视频数据回调
zegoClient.onEventHandler("onVideoData", rs =>{
  
  try {
    let auxWindowId = remote.getGlobal('auxWindowId')
    ipcRenderer.sendTo(auxWindowId, 'videodata', rs)    
  } catch (error) {
    console.log("send to aux windows error: ", error)
  }

})