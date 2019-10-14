// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// 引入zego sdk
var ZegoLiveRoom = require("zegoliveroom/ZegoLiveRoom.js");
var ZEGOCONSTANTS = require("zegoliveroom/ZegoConstant.js");

// app id
const app_id = ;//向zego获取app id，ID为字符串,请在 [即构管理控制台](https://console.zego.im/acount) 申请 SDK 初始化需要的 AppID 和 AppSign, [获取 AppID 和 AppSign 指引](https://doc.zego.im/API/HideDoc/GetAppIDGuide/GetAppIDGuideline.html)
// app sign
const app_sign = [];//向zego获取测试app_sign，是一个数组，格式例如 [0x01, 0x03, 0x44, ....]

// 创建zego client
var zegoClient = new ZegoLiveRoom();

const getVersionButton = document.getElementById("getVersion");
const initButton = document.getElementById("init");
const loginButton = document.getElementById("login");
const selectVideoDeviceButton = document.getElementById("selectVideoDevice");
const previewButton = document.getElementById("preview");
const stopPreviewButton = document.getElementById("stopPreview");
const publishStreamButton = document.getElementById("publishStream");
const playStreamButton = document.getElementById("playStream");
const stopPlayButton = document.getElementById("stopPlay");
const startRecordButton = document.getElementById("startRecord");
const stopRecordButton = document.getElementById("stopRecord");
const stopPublishButton = document.getElementById("stopPublish");
const logoutRoomButton = document.getElementById("logoutRoom");
const uninitSdkButton = document.getElementById("uninitSdk");
const sendMediaSideInfoButton = document.getElementById("sendMediaSideInfo");

const changeImgCaptureSrcButton = document.getElementById("changeImgCaptureSrc");
const changeCameraCaptureSrcButton = document.getElementById("changeCameraCaptureSrc");
const changeScreenCaptureSrcButton = document.getElementById("changeScreenCaptureSrc");
const changeVideoFileCaptureSrcButton = document.getElementById("changeVideoFileCaptureSrc");

var custom_capture_channel_index  = ZEGOCONSTANTS.PublishChannelIndex.PUBLISH_CHN_AUX;
var camera_channel_index  = ZEGOCONSTANTS.PublishChannelIndex.PUBLISH_CHN_MAIN;

var img_cap_src = null;
var camera_cap_src = null;
var screen_cap_src = null;
var video_file_cap_src = null;

var cur_sel_camera_index = 5;

// 创建图像源
function createImgCaptureSrc()
{
  let cap_src = zegoClient.createCustomCaptureSource({capture_type:ZEGOCONSTANTS.ZegoCustomCaptureType.IMAGE_TYPE});
  if(cap_src != -1){
      console.log("创建图像源成功，cap_src = ", cap_src);
      zegoClient.setImageCaptureSourceParam({capture_src:cap_src, image_path:"d:/lenna.bmp"});
      img_cap_src = cap_src;
  }else {
      console.log("创建图像源失败");
  }
}

// 创建屏幕分享源
function createScreenCaptureSrc()
{
  let cap_src = zegoClient.createCustomCaptureSource({capture_type:ZEGOCONSTANTS.ZegoCustomCaptureType.SCREEN_TYPE});
  if(cap_src != -1){
      console.log("创建屏幕分享源成功，cap_src = ", cap_src);
      screen_cap_src = cap_src;
  }else {
      console.log("创建屏幕分享源失败");
  }
}

// 创建摄像头源
function createCameraCaptureSrc()
{
  let cap_src = zegoClient.createCustomCaptureSource({capture_type:ZEGOCONSTANTS.ZegoCustomCaptureType.CAMERA_TYPE});  
  if(cap_src != -1){
      console.log("创建摄像头采集源成功，cap_src = ", cap_src);
      camera_cap_src = cap_src;
  }else {
      console.log("创建摄像头采集源失败");
  }    
}

// 创建视频文件源
function createVideoFileCaptureSrc()
{
  let cap_src = zegoClient.createCustomCaptureSource({capture_type:ZEGOCONSTANTS.ZegoCustomCaptureType.VIDEO_FILE_TYPE});  
  if(cap_src != -1){
      console.log("创建视频文件源成功，cap_src = ", cap_src);
      video_file_cap_src = cap_src;
  }else {
      console.log("创建视频文件源失败");
  }
}


// 切换为图片源
let img_change = true;
changeImgCaptureSrcButton.onclick = () => {
    
    if(img_change){
        img_change = false;
        zegoClient.setImageCaptureSourceParam({capture_src:img_cap_src, image_path:"d:/cornfield.bmp"});
    }else{
        img_change = true;
        zegoClient.setImageCaptureSourceParam({capture_src:img_cap_src, image_path:"d:/lenna.bmp"});
    }
    
    let ret = zegoClient.setCustomCaptureSource({capture_src:img_cap_src, channel_index:custom_capture_channel_index});
    
    zegoClient.setVideoFPS({fps:5, channel_index:custom_capture_channel_index});
    
    console.log("setCustomCaptureSource ret = ", ret);
}

// 切换为摄像头源
changeCameraCaptureSrcButton.onclick = () => {
  
  // 获取摄像头设备列表
  let video_devices_list = zegoClient.getVideoDeviceList();
  console.log("got video devices list:", video_devices_list);
  if(video_devices_list.length > 0){
      
    zegoClient.setCameraCaptureSourceParam({capture_src:camera_cap_src, device_id:video_devices_list[cur_sel_camera_index].device_id})
    
    console.log(video_devices_list[cur_sel_camera_index].device_id);
    
    cur_sel_camera_index = cur_sel_camera_index + 1
    if(cur_sel_camera_index >= video_devices_list.length)
    {
        cur_sel_camera_index = 0;
    }
  }
  
  let ret = zegoClient.setCustomCaptureSource({capture_src:camera_cap_src, channel_index:custom_capture_channel_index});
  console.log("setCustomCaptureSource ret = ", ret);
  
  zegoClient.setVideoFPS({fps:15, channel_index:custom_capture_channel_index});
  zegoClient.setVideoEncodeResolution({width:640, height:480, channel_index:custom_capture_channel_index});
  zegoClient.setVideoBitrate({bitrate: 600000, channel_index:custom_capture_channel_index});
  
}

var target_window_list = null
var current_sel_window_index = 0

function testChangeCaptureWindow()
{
    
    let screen_list = zegoClient.screenCaptureEnumScreenList();
    console.log("屏幕列表:", screen_list);

    if(target_window_list == null)
    {
        target_window_list = zegoClient.screenCaptureEnumWindowList({is_include_iconic:false});
        
        console.log("窗口列表:", target_window_list);      
    }
    
    zegoClient.setScreenCaptureSourceParam({capture_src:screen_cap_src, target_window:target_window_list[current_sel_window_index].handle, target_window_model:1});
    
    console.log("当前选择分享的窗口:",target_window_list[current_sel_window_index])
    
    current_sel_window_index = current_sel_window_index + 1
    
    if(current_sel_window_index >= target_window_list.length)
    {
        current_sel_window_index = 0;
    }
}

function testShareFullScreen()
{    
    zegoClient.setScreenCaptureSourceParam({capture_src:screen_cap_src, full_screen:true});   
}


var ktarget_rect_left = 0
var ktarget_rect_top = 0 
var ktarget_rect_width = 500
var ktarget_rect_height = 500

function testChangeCaptureRect()
{    
    let screen_list = zegoClient.screenCaptureEnumScreenList();
    console.log("屏幕列表:", screen_list);    
    
    zegoClient.setScreenCaptureSourceParam({capture_src:screen_cap_src, target_screen:screen_list[0].screen_name, target_rect_left:ktarget_rect_left, target_rect_top:ktarget_rect_top, target_rect_width:ktarget_rect_width, target_rect_height:ktarget_rect_height});
    ktarget_rect_width = ktarget_rect_width + 100;
    ktarget_rect_height = ktarget_rect_height + 100;
    console.log(ktarget_rect_width, ktarget_rect_height);
}


// 切换为屏幕分享源
changeScreenCaptureSrcButton.onclick = () => {
          
    let ret = zegoClient.setCustomCaptureSource({capture_src:screen_cap_src, channel_index:custom_capture_channel_index});
    console.log("setCustomCaptureSource screen_cap_src ret = ", ret);
    
    //zegoClient.setScreenCaptureSourceParam({capture_src:screen_cap_src,cursor_visible:false});
    //zegoClient.setScreenCaptureSourceParam({capture_src:screen_cap_src,click_animation:false});
    
    //testChangeCaptureWindow();
    
    //testChangeCaptureRect();
    
    testShareFullScreen();
    
    zegoClient.setVideoFPS({fps:15, channel_index:custom_capture_channel_index});
    zegoClient.setVideoEncodeResolution({width:1920, height:1080, channel_index:custom_capture_channel_index});
    zegoClient.setVideoBitrate({bitrate: 3000000, channel_index:custom_capture_channel_index});    
}

// 切换为视频文件源
changeVideoFileCaptureSrcButton.onclick = () => {
    
    zegoClient.setVideoFileCaptureSourceParam({capture_src:video_file_cap_src, video_file_path:"D:/ad.mp4",  is_repeat:true})
    
    let ret = zegoClient.setCustomCaptureSource({capture_src:video_file_cap_src, channel_index:custom_capture_channel_index});
    console.log("setCustomCaptureSource ret video_file_cap_src = ", ret);
    // 
    zegoClient.setVideoFPS({fps:15, channel_index:custom_capture_channel_index});
    
    zegoClient.setVideoEncodeResolution({width:1920, height:1080, channel_index:custom_capture_channel_index});
    zegoClient.setVideoBitrate({bitrate: 3000000, channel_index:custom_capture_channel_index});    
}


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
const TEST_ROOM_ID = "test" + randomWord(5);
// 房间名字
const TEST_ROOM_NAME="test_room_name" + randomWord(5);
// 推流的流id
const TEST_PUB_STREAM_ID = "test" + randomWord(5);
// 拉流的流id
const TEST_PLAY_STREAM_ID = TEST_PUB_STREAM_ID;

// 获取版本号
getVersionButton.onclick = () => {
  document.getElementById("sdkversiontext").innerText = zegoClient.getSDKVersion();
}

// 初始化sdk
initButton.onclick = () => {
  
  // 设置辅通道音频源，来自外部采集
  let r = zegoClient.setAudioSrcForAuxiliaryPublishChannel({type:1});
  console.log("setAudioSrcForAuxiliaryPublishChannel = " + r)
    
  zegoClient.enableAddonLog({enable:true});
  
  // 配置设置当前环境为测试环境
  zegoClient.setUseEnv({ use_test_env: true });
  
  // custom_capture_channel_index通道，开启自定义采集源，用于分享屏幕
  zegoClient.enableCustomCapture({ channel_index:custom_capture_channel_index });
  
  // 初始化sdk
  let ret = zegoClient.initSDK({
    app_id: app_id,
    sign_key: app_sign,
    user_id: TEST_USER_ID,
    user_name: TEST_USER_NAME
  }, rs => {
    if (rs.error_code == 0) {
      console.log("sdk初始化成功");
      
      // 创建屏幕分享源
      createScreenCaptureSrc();
      // 创建摄像头分享源
      createCameraCaptureSrc();
      // 创建图片分享源
      createImgCaptureSrc();
      // 创建视频文件分享源
      createVideoFileCaptureSrc();

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
  
  // 系统声卡采集
  zegoClient.enableMixSystemPlayout({enable:true});
  
  zegoClient.setVideoCaptureResolution({width:1080, height:720, channel_index:camera_channel_index});
  zegoClient.setVideoEncodeResolution({width:1080, height:720, channel_index:camera_channel_index});  
  // 预览视频
  let set_ret = zegoClient.setPreviewView({
    canvas_view: document.getElementById("localVideo"),
    channel_index: camera_channel_index
  });
  if (set_ret) {
    let preview_ret = zegoClient.startPreview({
      channel_index: camera_channel_index
    });
    console.log("预览结果", preview_ret);
    
    // 开启回音消除
    zegoClient.enableAEC({enable:true});
    
    // 开启噪音消除
    zegoClient.enableANS({enable:true});
    
    // 开启增益
    zegoClient.enableAGC({enable:true});    
    
  }
  
zegoClient.setPreviewView({
    canvas_view: document.getElementById("screen"),
    channel_index: custom_capture_channel_index
  });  
  
zegoClient.startPreview({
  channel_index: custom_capture_channel_index
});  
}

stopPreviewButton.onclick = () => {
    
    zegoClient.stopPreview({});
}

// 开始推流
publishStreamButton.onclick = () => {
  // 开始推流，主通道，摄像头
  let ret = zegoClient.startPublishing({
    title: "zego electron simple test camera",
    stream_id: TEST_PUB_STREAM_ID + "_camera",
    publish_flag: ZEGOCONSTANTS.ZegoPublishFlag.ZEGO_JOIN_PUBLISH,
    params: "",
    channel_index: camera_channel_index
  });  
  
  // 开始推流，辅通道，屏幕采集
  //zegoClient.startPublishing({
  //  title: "zego electron simple test screen",
  //  stream_id: TEST_PUB_STREAM_ID + "_screen",
  //  publish_flag: ZEGOCONSTANTS.ZegoPublishFlag.ZEGO_JOIN_PUBLISH,
  //  params: "",
  //  channel_index: custom_capture_channel_index
  //});
}

// 开始录制
startRecordButton.onclick = () => {
    // 录制辅通道，屏幕采集
    zegoClient.startRecord({storage_path:"d:\\zego_record.mp4", channel_index: custom_capture_channel_index})
}

// 停止录制
stopRecord.onclick = () => {    
    zegoClient.stopRecord({channel_index: custom_capture_channel_index});
}

// 开始拉流播放
playStreamButton.onclick = () => {
  zegoClient.startPlayingStream({
    stream_id: TEST_PLAY_STREAM_ID + "_camera" ,
    canvas_view: document.getElementById("remoteVideo"),
    params: ""
  });

  //zegoClient.startPlayingStream({
  //  stream_id: TEST_PLAY_STREAM_ID + "_screen",
  //  canvas_view: document.getElementById("remoteScreen"),
  //  params: ""
  //});
  
// zegoClient.startPlayingStream2({
//   stream_id: "111",
//   canvas_view: document.getElementById("remoteVideo"),
//   urls:["rtmp://rtmp.ws.zego.im/zegodemo/111"],
//   params: "",
//   should_switch_server:true
//   
// });  
  
}

// 停止拉流
stopPlayButton.onclick = () => {
  zegoClient.stopPlayingStream({ stream_id: TEST_PLAY_STREAM_ID + "_camera"  });
  //zegoClient.stopPlayingStream({ stream_id: TEST_PLAY_STREAM_ID + "_screen"  });
}

// 停止推流
stopPublishButton.onclick = () => {
  zegoClient.stopPublishing({ channel_index: camera_channel_index });
  //zegoClient.stopPublishing({ channel_index: custom_capture_channel_index });
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

// 录制回调
zegoClient.onEventHandler("onMediaRecord", rs => {
  console.log("录制结果回调，onMediaRecord, rs = ", rs);
});

// 收到媒体次要信息回调
zegoClient.onEventHandler("onRecvMediaSideInfo", rs => {console.log("收到媒体次要信息", rs);})

const { remote } = require('electron')
const goButton = document.getElementById("go");

goButton.onclick = () =>{
    
    remote.getCurrentWebContents().loadURL(document.getElementById("urlContent").value)
}




