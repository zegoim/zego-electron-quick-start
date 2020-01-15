// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// 引入zego sdk
var ZegoLiveRoom =  window.require("zegoliveroom/ZegoLiveRoom.js");
var ZEGOCONSTANTS =  window.require("zegoliveroom/ZegoConstant.js");

// 引入FaceUnity的滤镜插件
var ZegoVideoFilterDemo = require("zegoliveroom/ZegoVideoFilter.node");

// app id
const app_id = ;//向zego获取app id，ID为字符串,请在 [即构管理控制台](https://console.zego.im/acount) 申请 SDK 初始化需要的 AppID 和 AppSign, [获取 AppID 和 AppSign 指引](https://doc.zego.im/API/HideDoc/GetAppIDGuide/GetAppIDGuideline.html)
// app sign
const app_sign = [];//向zego获取测试app_sign，是一个数组，格式例如 [0x01, 0x03, 0x44, ....]

console.log("")
console.log("")
console.log("")
console.log("请在 [即构管理控制台](https://console.zego.im/acount) 申请 SDK 初始化需要的 AppID 和 AppSign");
console.log("[获取 AppID 和 AppSign 指引](https://doc.zego.im/API/HideDoc/GetAppIDGuide/GetAppIDGuideline.html)。");
console.log("申请到appid和sign后，修改renderer.js文件第10、12行代码为自己申请到的appid和app_sign。");
console.log("")
console.log("")
console.log("")
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
const sliderButton = document.getElementById("slider1");

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
  
  // 从官网申请的 AppID 默认是测试环境，而 SDK 初始化默认是正式环境，所以需要在初始化 SDK 前设置测试环境，否则 SDK 会初始化失败，当 App 集成完成后，再向 ZEGO 申请开启正式环境。
  // 配置设置当前环境为测试环境
  zegoClient.setUseEnv({ use_test_env: true }); // 注意：上线前需切换为正式环境运营。
  

  // 获取外部滤镜插件工厂
  let fac = ZegoVideoFilterDemo.getVideoFilterFactory()
  
  // 设置外部滤镜工厂，必须在initSdk之前调用
  // zegoClient 是 ZEGO Electron SDK ZegoLiveRoom 的实例
  zegoClient.setVideoFilterFactory({factory: fac})
  
  // 初始化FaceUnity美颜滤镜的参数
  // 参数1：填FaceUnity 的license ，形式为 [-123,23,34,-34,45] 
  // 参数2：填FaceUnity 的资源文件 v3.bundle 的路径
  // 参数3：填FaceUnity 的资源文件 face_beautification.bundle 的路径
  // 参数4：初始化回调，返回结果对象中error_code 为 0 - 成功， -1 - 失败
  // 返回值：false - 参数无效，true - 正在异步初始化美颜库
  // 
  let init_fu_sdk_ret = ZegoVideoFilterDemo.initFuBeautyConfig([此处填写FaceUnity的license，形式是一个数组], "此处填写FaceUnity 的 v3.bundle的文件路径", "此处填写FaceUnity 的 face_beautification.bundle的文件路径", function(rs){
        console.log(rs)
        if(rs.error_code == 0)
        {
            ZegoVideoFilterDemo.enableBeauty(true);
            
            let fu_config_ret = ZegoVideoFilterDemo.updateBeautyLevel(10);
            
            if(fu_config_ret == true)
            {
                console.log("美颜配置成功");
                
            }else{
                console.log("美颜配置失败");
            }
        }
      }
    );
        
  if(!init_fu_sdk_ret)
  {
    console.log("美颜配置失败");
  }  
  
  
  // 初始化sdk
  let ret = zegoClient.initSDK({
    app_id: app_id,
    sign_key: app_sign,
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
    //  = 0        拉流成功 , 其它错误码 查看官网错误码列表 https://doc.zego.im/API/HideDoc/ErrorCodeTable.html
    console.log('拉流失败,错误码为' + rs.error_code);
  }
});

// 拉流质量更新事件通知
zegoClient.onEventHandler("onPlayQualityUpdate", rs => {
  //console.log("拉流质量更新事件通知，onPlayQualityUpdate, rs = ", rs);
});


// 推流状态更新返回
zegoClient.onEventHandler("onPublishStateUpdate", rs => {
  console.log("推流状态更新返回，onPublishStateUpdate, rs = ", rs);
  if (rs.error_code == 0) {
    console.log("推流成功, 流id=" + rs.stream_id);
  } else {
    // 错误码
    //  = 0        推流成功, 其它错误码 查看官网错误码列表 https://doc.zego.im/API/HideDoc/ErrorCodeTable.html
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
zegoClient.onEventHandler("onPublishQualityUpdate", rs => {
    //console.log("推流质量通知，onPublishQualityUpdate, rs = ", rs); 
});
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

const { remote } = require('electron')
const goButton = document.getElementById("go");

goButton.onclick = () =>{
    
    remote.getCurrentWebContents().loadURL(document.getElementById("urlContent").value)
}

sliderButton.onclick = () =>{
    
    console.log(document.getElementById("slider1").value)
    
    let level = parseInt(document.getElementById("slider1").value)
    
    if(level == 0)
    {
        ZegoVideoFilterDemo.enableBeauty(false);
    }else{
        ZegoVideoFilterDemo.enableBeauty(true);        
    }
    
    ZegoVideoFilterDemo.updateBeautyLevel(level);

}

// filter_level 取值范围 0.0-1.0,0.0为无效果，1.0为最大效果，默认值1.0
var filter_level = 1.0
document.getElementById("filter_level").onclick = () =>{
    filter_level = parseFloat(document.getElementById("filter_level").value)
    console.log("filter_level = " + filter_level)
    updateBeautyParam()
}

// filter_name 取值为一个字符串，默认值为 “origin” ，origin即为使用原图效果
var filter_name = "origin"
document.getElementById("filter_name").onchange = () =>{
    filter_name = document.getElementById("filter_name").value
    console.log("filter_name = " + filter_name)
    updateBeautyParam()
}

// 美白
// color_level 取值范围 0.0-1.0,0.0为无效果，1.0为最大效果，默认值0.2
var color_level = 0.2
document.getElementById("color_level").onclick = () =>{
    color_level = parseFloat(document.getElementById("color_level").value)
    console.log("color_level = " + color_level)
    updateBeautyParam()
}

// 红润
// red_level 取值范围 0.0-1.0,0.0为无效果，1.0为最大效果，默认值0.5
var red_level = 0.5
document.getElementById("red_level").onclick = () =>{
    red_level = parseFloat(document.getElementById("red_level").value)
    console.log("red_level = " + red_level)
    updateBeautyParam()
}

// 磨皮
// 控制磨皮的参数有四个：blur_level，skin_detect，nonskin_blur_scale，heavy_blur，blur_type


// blur_level: 磨皮程度，取值范围0.0-6.0，默认6.0
var blur_level = 1
document.getElementById("blur_level").onclick = () =>{
    blur_level = parseInt(document.getElementById("blur_level").value)
    console.log("blur_level = " + blur_level)
    updateBeautyParam()
}

// skin_detect:肤色检测开关，0为关，1为开
var skin_detect = 1
document.getElementById("skin_detect").onclick = () =>{
    skin_detect = parseInt(document.getElementById("skin_detect").value)
    console.log("skin_detect = " + skin_detect)
    updateBeautyParam()
}


// nonskin_blur_scale:肤色检测之后非肤色区域的融合程度，取值范围0.0-1.0，默认0.45
var nonskin_blur_scale = 0.45
document.getElementById("nonskin_blur_scale").onclick = () =>{
    nonskin_blur_scale = parseFloat(document.getElementById("nonskin_blur_scale").value)
    console.log("nonskin_blur_scale = " + nonskin_blur_scale)
    updateBeautyParam()
}


// heavy_blur: 朦胧磨皮开关，0为清晰磨皮，1为朦胧磨皮
var heavy_blur = 0
document.getElementById("heavy_blur").onclick = () =>{
    heavy_blur = parseInt(document.getElementById("heavy_blur").value)
    console.log("heavy_blur = " + heavy_blur)
    updateBeautyParam()
}

// blur_type：此参数优先级比heavy_blur低，在使用时要将heavy_blur设为0，0 清晰磨皮  1 朦胧磨皮  2精细磨皮
var blur_type = 2
document.getElementById("blur_type").onclick = () =>{
    blur_type = parseInt(document.getElementById("blur_type").value)
    console.log("blur_type = " + blur_type)
    updateBeautyParam()
}

// 亮眼 eye_bright   取值范围 0.0-1.0,0.0为无效果，1.0为最大效果，默认值1.0
var eye_bright = 1.0
document.getElementById("eye_bright").onclick = () =>{
    eye_bright = parseFloat(document.getElementById("eye_bright").value)
    console.log("eye_bright = " + eye_bright)
    updateBeautyParam()
}

// 美牙 tooth_whiten   取值范围 0.0-1.0,0.0为无效果，1.0为最大效果，默认值1.0
var tooth_whiten = 1.0
document.getElementById("tooth_whiten").onclick = () =>{
    tooth_whiten = parseFloat(document.getElementById("tooth_whiten").value)
    console.log("tooth_whiten = " + tooth_whiten)
    updateBeautyParam()
}

// 美型 face_shape_level   取值范围 0.0-1.0,0.0为无效果，1.0为最大效果，默认值1.0
var face_shape_level = 1.0
document.getElementById("face_shape_level").onclick = () =>{
    face_shape_level = parseFloat(document.getElementById("face_shape_level").value)
    console.log("face_shape_level = " + face_shape_level)
    updateBeautyParam()
}

// 美型的渐变由change_frames参数控制
// change_frames       0为关闭 ，大于0开启渐变，值为渐变所需要的帧数
var change_frames = 0
document.getElementById("change_frames").onclick = () =>{
    change_frames = parseInt(document.getElementById("change_frames").value)
    console.log("change_frames = " + change_frames)
    updateBeautyParam()
}

// 美型的种类主要由face_shape 参数控制
// face_shape: 变形取值 0:女神变形 1:网红变形 2:自然变形 3:默认变形 4:精细变形
var face_shape = 3
document.getElementById("face_shape").onclick = () =>{
    face_shape = parseInt(document.getElementById("face_shape").value)
    console.log("face_shape = " + face_shape)
    updateBeautyParam()
}

// face_shape 为0 1 2 3时
// 对应0：女神 1：网红 2：自然 3：默认
// 可以使用参数
// eye_enlarging: 	默认0.5,		//大眼程度范围0.0-1.0
// cheek_thinning:	默认0.0,  		//瘦脸程度范围0.0-1.0

// face_shape 为4时，为用户自定义的精细变形，开放了脸型相关参数，添加了窄脸小脸参数
// eye_enlarging: 	默认0.5,		//大眼程度范围0.0-1.0
// cheek_thinning:	默认0.0,  		//瘦脸程度范围0.0-1.0
// cheek_v:	默认0.0,  		//v脸程度范围0.0-1.0
// cheek_narrow:   默认0.0,          //窄脸程度范围0.0-1.0
// cheek_small:   默认0.0,          //小脸程度范围0.0-1.0
// intensity_nose: 默认0.0,        //瘦鼻程度范围0.0-1.0
// intensity_forehead: 默认0.5,    //额头调整程度范围0.0-1.0，0-0.5是变小，0.5-1是变大
// intensity_mouth:默认0.5,       //嘴巴调整程度范围0.0-1.0，0-0.5是变小，0.5-1是变大
// intensity_chin: 默认0.5,       //下巴调整程度范围0.0-1.0，0-0.5是变小，0.5-1是变大
var eye_enlarging = 0.5
document.getElementById("eye_enlarging").onclick = () =>{
    eye_enlarging = parseFloat(document.getElementById("eye_enlarging").value)
    console.log("eye_enlarging = " + eye_enlarging)
    updateBeautyParam()
}

var cheek_thinning = 0.0
document.getElementById("cheek_thinning").onclick = () =>{
    cheek_thinning = parseFloat(document.getElementById("cheek_thinning").value)
    console.log("cheek_thinning = " + cheek_thinning)
    updateBeautyParam()
}

var cheek_v = 0.0
document.getElementById("cheek_v").onclick = () =>{
    cheek_v = parseFloat(document.getElementById("cheek_v").value)
    console.log("cheek_v = " + cheek_v)
    updateBeautyParam()
}

var cheek_narrow = 0.0
document.getElementById("cheek_narrow").onclick = () =>{
    cheek_narrow = parseFloat(document.getElementById("cheek_narrow").value)
    console.log("cheek_narrow = " + cheek_narrow)
    updateBeautyParam()
}

var cheek_small = 0.0
document.getElementById("cheek_small").onclick = () =>{
    cheek_small = parseFloat(document.getElementById("cheek_small").value)
    console.log("cheek_small = " + cheek_small)
    updateBeautyParam()
}

var intensity_nose = 0.0
document.getElementById("intensity_nose").onclick = () =>{
    intensity_nose = parseFloat(document.getElementById("intensity_nose").value)
    console.log("intensity_nose = " + intensity_nose)
    updateBeautyParam()
}

var intensity_forehead = 0.5
document.getElementById("intensity_forehead").onclick = () =>{
    intensity_forehead = parseFloat(document.getElementById("intensity_forehead").value)
    console.log("intensity_forehead = " + intensity_forehead)
    updateBeautyParam()
}

var intensity_mouth = 0.5
document.getElementById("intensity_mouth").onclick = () =>{
    intensity_mouth = parseFloat(document.getElementById("intensity_mouth").value)
    console.log("intensity_mouth = " + intensity_mouth)
    updateBeautyParam()
}

var intensity_chin = 0.5
document.getElementById("intensity_chin").onclick = () =>{
    intensity_chin = parseFloat(document.getElementById("intensity_chin").value)
    console.log("intensity_chin = " + intensity_chin)
    updateBeautyParam()
}

//
//    ZegoVideoFilterDemo.setParameter(JSON.stringify({"plugin.fu.bundles.load": [{
//          bundlePath: "E:\\zego-electron-quick-start\\Res\\",
//          bundleName: "face_beautification.bundle",
//          bundleOptions: {
//              "filter_level":filter_level,
//              "filter_name":filter_name,
//              "color_level": color_level,
//              "red_level": red_level,
//              "blur_level": blur_level,
//              "skin_detect": skin_detect,
//              "heavy_blur": heavy_blur,
//              "blur_type": blur_type,
//              "eye_bright": eye_bright,
//              "tooth_whiten": tooth_whiten,
//              "face_shape_level": face_shape_level,
//              "change_frames": change_frames,
//              "face_shape": face_shape,
//              "eye_enlarging": eye_enlarging,
//              "cheek_thinning": cheek_thinning,
//              "cheek_v": cheek_v,
//              "cheek_narrow": cheek_narrow,
//              "cheek_small": cheek_small,
//              "intensity_nose": intensity_nose,
//              "intensity_forehead": intensity_forehead,
//              "intensity_mouth": intensity_mouth,
//              "intensity_chin": intensity_chin
//          }
//        }]}))
//
function updateBeautyParam()
{
    let update_param_obj = {"plugin.fu.bundles.update": {
                        bundleName: "face_beautification.bundle",
                        bundleOptions: {
                          "filter_level":filter_level,
                          "filter_name":filter_name,
                          "color_level": color_level,
                          "red_level": red_level,
                          "blur_level": blur_level,
                          "skin_detect": skin_detect,
                          "heavy_blur": heavy_blur,
                          "blur_type": blur_type,
                          "eye_bright": eye_bright,
                          "tooth_whiten": tooth_whiten,
                          "face_shape_level": face_shape_level,
                          "change_frames": change_frames,
                          "face_shape": face_shape,
                          "eye_enlarging": eye_enlarging,
                          "cheek_thinning": cheek_thinning,
                          "cheek_v": cheek_v,
                          "cheek_narrow": cheek_narrow,
                          "cheek_small": cheek_small,
                          "intensity_nose": intensity_nose,
                          "intensity_forehead": intensity_forehead,
                          "intensity_mouth": intensity_mouth,
                          "intensity_chin": intensity_chin
                        }
                      }}
    
    console.log("update param  = ", update_param_obj)
    
    let ret = ZegoVideoFilterDemo.setParameter(JSON.stringify(update_param_obj))
                      
    console.log("ret = ", ret)
    
    console.log("具体参数范围调节，请查看 https://github.com/Faceunity/FULivePC/blob/master/docs/%E7%BE%8E%E9%A2%9C%E9%81%93%E5%85%B7%E5%8A%9F%E8%83%BD%E6%96%87%E6%A1%A3.md ")
}































