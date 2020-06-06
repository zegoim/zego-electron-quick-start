// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// 引入zego sdk
var ZegoLiveRoom = require("zegoliveroom/ZegoLiveRoom.js");
var ZEGOCONSTANTS = require("zegoliveroom/ZegoConstant.js");

// app id
const app_id = ""; //向zego获取app id，ID为字符串
// app key
const sign_key = [];
//向zego获取测试sign key，是一个数组，格式例如 [0x01, 0x03, 0x44, ....]

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
var TEST_USER_ID = "test_user_id" + randomWord(5);
// 用户名字
var TEST_USER_NAME = "test_user_name" + randomWord(5);
// 房间id
var TEST_ROOM_ID = "888"// + randomWord(5);
// 房间名字
var TEST_ROOM_NAME="test_room_name" + randomWord(5);
// 推流的流id
var TEST_PUB_STREAM_ID = "test_stream_id" + randomWord(5);
// 推流到远端在录制时用到，本地录制时只要预览即可
var TEST_PUB_SCREEN_STREAM_ID = "999"

var TEST_PLAY_STREAM_ID = TEST_PUB_STREAM_ID


var user_zego_test_env = true;


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

const changeImgCaptureSrcButton = document.getElementById(
  "changeImgCaptureSrc"
);
const changeCameraCaptureSrcButton = document.getElementById(
  "changeCameraCaptureSrc"
);
const changeScreenCaptureSrcButton = document.getElementById(
  "changeScreenCaptureSrc"
);
const changeVideoFileCaptureSrcButton = document.getElementById(
  "changeVideoFileCaptureSrc"
);
const changeVideoFileCaptureSrcButton2 = document.getElementById(
  "changeVideoFileCaptureSrc2"
);

// 主通道索引
var current_channel_index = 0;
// 辅通道索引
var current_channel_index2 = 1;

var img_cap_src = null;
var camera_cap_src = null;
var screen_cap_src = null;
var video_file_cap_src = null;

var video_file_cap_src2 = null;

var cur_sel_camera_index = 0;

// 创建图像源
function createImgCaptureSrc() {
  let cap_src = zegoClient.createCustomCaptureSource({
    capture_type: ZEGOCONSTANTS.ZegoCustomCaptureType.IMAGE_TYPE
  });
  if (cap_src != -1) {
    console.log("创建图像源成功，cap_src = ", cap_src);
    zegoClient.setImageCaptureSourceParam({
      capture_src: cap_src,
      image_path: "d:/lenna.bmp"
    });
    img_cap_src = cap_src;
  } else {
    console.log("创建图像源失败");
  }
}

// 创建屏幕分享源
function createScreenCaptureSrc() {
  let cap_src = zegoClient.createCustomCaptureSource({
    capture_type: ZEGOCONSTANTS.ZegoCustomCaptureType.SCREEN_TYPE
  });
  if (cap_src != -1) {
    console.log("创建屏幕分享源成功，cap_src = ", cap_src);
    screen_cap_src = cap_src;
  } else {
    console.log("创建屏幕分享源失败");
  }
}

// 创建摄像头源
function createCameraCaptureSrc() {
  let cap_src = zegoClient.createCustomCaptureSource({
    capture_type: ZEGOCONSTANTS.ZegoCustomCaptureType.CAMERA_TYPE
  });
  if (cap_src != -1) {
    console.log("创建摄像头采集源成功，cap_src = ", cap_src);
    camera_cap_src = cap_src;
  } else {
    console.log("创建摄像头采集源失败");
  }
}

// 创建视频文件源
function createVideoFileCaptureSrc() {
  let cap_src = zegoClient.createCustomCaptureSource({
    capture_type: ZEGOCONSTANTS.ZegoCustomCaptureType.VIDEO_FILE_TYPE
  });
  if (cap_src != -1) {
    console.log("创建视频文件源成功，cap_src = ", cap_src);
    video_file_cap_src = cap_src;
  } else {
    console.log("创建视频文件源失败");
  }
}

// 创建视频文件源2
function createVideoFileCaptureSrc2() {
  let cap_src = zegoClient.createCustomCaptureSource({
    capture_type: ZEGOCONSTANTS.ZegoCustomCaptureType.VIDEO_FILE_TYPE
  });
  if (cap_src != -1) {
    console.log("创建视频文件源成功，cap_src = ", cap_src);
    video_file_cap_src2 = cap_src;
  } else {
    console.log("创建视频文件源失败");
  }
}

// 切换为图片源
let img_change = true;
changeImgCaptureSrcButton.onclick = () => {
  if (img_change) {
    img_change = false;
    zegoClient.setImageCaptureSourceParam({
      capture_src: img_cap_src,
      image_path: "d:/cornfield.bmp"
    });
  } else {
    img_change = true;
    zegoClient.setImageCaptureSourceParam({
      capture_src: img_cap_src,
      image_path: "d:/lenna.bmp"
    });
  }

  let ret = zegoClient.setCustomCaptureSource({
    capture_src: img_cap_src,
    channel_index: current_channel_index
  });

  zegoClient.setVideoFPS({ fps: 5, channel_index: current_channel_index });

  console.log("setCustomCaptureSource ret = ", ret);
};

// 切换为摄像头源
 changeCameraCaptureSrcButton.onclick = () => {
  // 获取摄像头设备列表
  let video_devices_list = zegoClient.getVideoDeviceList();
  console.log("got video devices list:", video_devices_list);
  if (video_devices_list.length > 0) {
    zegoClient.setCameraCaptureSourceParam({
      capture_src: camera_cap_src,
      device_id: video_devices_list[cur_sel_camera_index].device_id
    });

    console.log(video_devices_list[cur_sel_camera_index].device_id);

    cur_sel_camera_index = cur_sel_camera_index + 1;
    if (cur_sel_camera_index >= video_devices_list.length) {
      cur_sel_camera_index = 0;
    }
  }

  let ret = zegoClient.setCustomCaptureSource({
    capture_src: camera_cap_src,
    channel_index: current_channel_index
  });
  console.log("setCustomCaptureSource ret = ", ret);

  zegoClient.setVideoFPS({ fps: 30, channel_index: current_channel_index });
  zegoClient.setVideoEncodeResolution({
    width: 1920,
    height: 1080,
    channel_index: current_channel_index
  });
  zegoClient.setVideoBitrate({
    bitrate: 1200000,
    channel_index: current_channel_index
  });
};

var target_window_list = null;
var current_sel_window_index = 0;

function testChangeCaptureWindow() {
  let screen_list = zegoClient.screenCaptureEnumScreenList();
  console.log("屏幕列表:", screen_list);

  if (target_window_list == null) {
    target_window_list = zegoClient.screenCaptureEnumWindowList({
      is_include_iconic: false
    });
    console.log("窗口列表:", target_window_list);
  }

  zegoClient.setScreenCaptureSourceParam({
    capture_src: screen_cap_src,
    target_window: target_window_list[current_sel_window_index].handle,
    target_window_model: 1
  });

  console.log(
    "当前选择分享的窗口:",
    target_window_list[current_sel_window_index]
  );

  current_sel_window_index = current_sel_window_index + 1;

  if (current_sel_window_index >= target_window_list.length) {
    current_sel_window_index = 0;
  }
}

function testShareFullScreen() {
  zegoClient.setScreenCaptureSourceParam({
    capture_src: screen_cap_src,
    full_screen: true
  });
}

var ktarget_rect_left = 0;
var ktarget_rect_top = 0;
var ktarget_rect_width = 500;
var ktarget_rect_height = 500;

function testChangeCaptureRect() {
  let screen_list = zegoClient.screenCaptureEnumScreenList();
  console.log("屏幕列表:", screen_list);

  zegoClient.setScreenCaptureSourceParam({
    capture_src: screen_cap_src,
    target_screen: screen_list[0].screen_name,
    target_rect_left: ktarget_rect_left,
    target_rect_top: ktarget_rect_top,
    target_rect_width: ktarget_rect_width,
    target_rect_height: ktarget_rect_height
  });
  ktarget_rect_width = ktarget_rect_width + 100;
  ktarget_rect_height = ktarget_rect_height + 100;
  console.log(ktarget_rect_width, ktarget_rect_height);
}

// 切换为屏幕分享源
changeScreenCaptureSrcButton.onclick = () => {
  let ret = zegoClient.setCustomCaptureSource({
    capture_src: screen_cap_src,
    channel_index: current_channel_index
  });
  console.log("setCustomCaptureSource screen_cap_src ret = ", ret);

  //zegoClient.setScreenCaptureSourceParam({capture_src:screen_cap_src,cursor_visible:false});
  
  //zegoClient.setScreenCaptureSourceParam({capture_src:screen_cap_src,click_animation:false});

  //testChangeCaptureWindow();

  //testChangeCaptureRect();

  testShareFullScreen();


};

var have_change = false
var have_set_source = false

// 切换为视频文件源
changeVideoFileCaptureSrcButton.onclick = () => {
    
    let file_path = ""
    if(have_change)
    {
        have_change = false
        file_path = "D:/pingan.mp4"
    }else{
        have_change = true
        file_path = "D:/ad.mp4"
    }
    
  zegoClient.setVideoFileCaptureSourceParam({
    capture_src: video_file_cap_src,
    video_file_path: file_path,
    is_repeat: false
  });
  
  if(!have_set_source)
  {
	  have_set_source = true
	  let ret = zegoClient.setCustomCaptureSource({
		capture_src: video_file_cap_src,
		channel_index: current_channel_index
	  });	  
  }


  console.log("setCustomCaptureSource ret video_file_cap_src = ", ret);
  //
  zegoClient.setVideoFPS({ fps: 15, channel_index: current_channel_index });

  zegoClient.setVideoEncodeResolution({
    width: 1920,
    height: 1080,
    channel_index: current_channel_index
  });
  zegoClient.setVideoBitrate({
    bitrate: 3000000,
    channel_index: current_channel_index
  });
};


var have_change2 = false
// 切换为视频文件源2
changeVideoFileCaptureSrcButton2.onclick = () => {
    
    let file_path = ""
    if(have_change2)
    {
        have_change2 = false
        file_path = "D:/teacher.mp4"
    }else{
        have_change2 = true
        file_path = "D:/ad.mp4"
    }
    
  zegoClient.setVideoFileCaptureSourceParam({
    capture_src: video_file_cap_src2,
    video_file_path: file_path,
    is_repeat: false,
	media_player_type:0,
	media_player_index:0
  });

  let ret = zegoClient.setCustomCaptureSource({
    capture_src: video_file_cap_src2,
    channel_index: current_channel_index2
  });
  console.log("setCustomCaptureSource ret video_file_cap_src2 = ", ret);
  //
  zegoClient.setVideoFPS({ fps: 15, channel_index: current_channel_index2 });

  zegoClient.setVideoEncodeResolution({
    width: 1920,
    height: 1080,
    channel_index: current_channel_index2
  });
  zegoClient.setVideoBitrate({
    bitrate: 3000000,
    channel_index: current_channel_index2
  });
};

var kVideoDeviceList = [];
var kMicDeviceList = [];
var kSpeakerDeviceList = [];

// 获取版本号
getVersionButton.onclick = () => {
  document.getElementById(
    "sdkversiontext"
  ).innerText = zegoClient.getSDKVersion();
};


document.getElementById("micDeviceList").onchange = () =>
{
	var index = document.getElementById("micDeviceList").selectedIndex;
	console.log("set mic device:", document.getElementById("micDeviceList").options[index].value, kMicDeviceList[index]);

	zegoClient.setAudioDevice({device_type:0, device_id: document.getElementById("micDeviceList").options[index].value})
}

document.getElementById("speakerDeviceList").onchange = () =>
{
	var index = document.getElementById("speakerDeviceList").selectedIndex;
	console.log("set speaker device:", document.getElementById("speakerDeviceList").options[index].value);
	zegoClient.setAudioDevice({device_type:1, device_id: document.getElementById("speakerDeviceList").options[index].value})
}

document.getElementById("videoDeviceList").onchange = () =>
{
	var index = document.getElementById("videoDeviceList").selectedIndex;
	console.log("set video device:", document.getElementById("videoDeviceList").options[index].value);
	zegoClient.setVideoDevice({device_id: document.getElementById("videoDeviceList").options[index].value, channel_index: current_channel_index2})
}


// 初始化sdk
initButton.onclick = () => {
	
  zegoClient.enableAddonLog({enable:true});

  // 配置设置当前环境为测试环境
  zegoClient.setUseEnv({ use_test_env: user_zego_test_env });
  
  // 开启辅通道的音频来源为mediaplayer
  zegoClient.setAudioSrcForAuxiliaryPublishChannel({type:10})
 
  // 开启主通道为自定义采集
  zegoClient.enableCustomCapture({ channel_index: current_channel_index });

  // 初始化sdk
  let ret = zegoClient.initSDK(
    {
      app_id: app_id,
      sign_key: sign_key,
      user_id: TEST_USER_ID,
      user_name: TEST_USER_NAME
    },
    rs => {
      if (rs.error_code == 0) {

		console.log("sdk初始化成功");

		kMicDeviceList = zegoClient.getAudioDeviceList({device_type:0})
		for(let i = 0;i < kMicDeviceList.length; ++i)
		{
			document.getElementById("micDeviceList").options.add(new Option(kMicDeviceList[i].device_name, kMicDeviceList[i].device_id));
		}

		zegoClient.setAudioDevice({device_type:0, device_id: document.getElementById("micDeviceList").options[0].value})

		kSpeakerDeviceList = zegoClient.getAudioDeviceList({device_type:1})
		for(let i = 0;i < kSpeakerDeviceList.length; ++i)
		{
			document.getElementById("speakerDeviceList").options.add(new Option(kSpeakerDeviceList[i].device_name, kSpeakerDeviceList[i].device_id));
		}
		zegoClient.setAudioDevice({device_type:1, device_id: document.getElementById("speakerDeviceList").options[0].value})

		kVideoDeviceList = zegoClient.getVideoDeviceList();

		for(let i = 0;i < kVideoDeviceList.length; ++i)
		{
			document.getElementById("videoDeviceList").options.add(new Option(kVideoDeviceList[i].device_name, kVideoDeviceList[i].device_id));
		}

		zegoClient.setVideoDevice({device_id: document.getElementById("videoDeviceList").options[0].value, channel_index: current_channel_index2})


		//
		// 开启系统声卡采集，需要录制系统播放的声音
		zegoClient.enableMixSystemPlayout({enable:true})	
		
		// 拉流声音混入主通道推流中，录制屏幕时需要录制拉流的声音
		zegoClient.mixEnginePlayout({enable:true})	

		// 创建屏幕采集源
        createScreenCaptureSrc();
		
		// 设置当前采集源为屏幕源
	    let ret = zegoClient.setCustomCaptureSource({
	  	capture_src: screen_cap_src,
	  	channel_index: current_channel_index
	    });
		
      } else {
        console.log("sdk初始化失败,错误码为：" + rs.error_code);
        zegoClient.unInitSDK();
      }
    }
  );
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
    let ret = zegoClient.loginRoom(
      {
        room_id: TEST_ROOM_ID,
        room_name: TEST_ROOM_NAME,
        role: ZEGOCONSTANTS.ZegoRoomRole.Audience
      },
      rs => {
        console.log("登录结果返回 ", rs);
        if (rs.error_code == 0) {
          console.log("登录成功");        
        } else {
          reject()
          console.log("登录失败，错误码为：" + rs.error_code);
        }
      }
    );
}


// 预览本地摄像头
previewButton.onclick = () => {

  // 预览视频
  let set_ret = zegoClient.setPreviewView({
    canvas_view: document.getElementById("localVideo"),
    channel_index: current_channel_index
  });

  let preview_ret = zegoClient.startPreview({
    channel_index: current_channel_index
  });
  
  zegoClient.setVideoFPS({ fps: 10, channel_index: current_channel_index });
  zegoClient.setVideoEncodeResolution({
    width: 1920,
    height: 1080,
    channel_index: current_channel_index
  });
  zegoClient.setVideoBitrate({
    bitrate: 1800000,
    channel_index: current_channel_index
  });  
  
  zegoClient.setVideoFPS({ fps: 15, channel_index: current_channel_index2 });
  zegoClient.setVideoEncodeResolution({
    width: 640,
    height: 480,
    channel_index: current_channel_index2
  });
  zegoClient.setVideoBitrate({
    bitrate: 600000,
    channel_index: current_channel_index2
  });  
    
  // 预览第二路通道
  zegoClient.setPreviewView({
    canvas_view: document.getElementById("localVideo2"),
    channel_index: current_channel_index2
  });
  
  zegoClient.startPreview({
    channel_index: current_channel_index2
  });  
};

stopPreviewButton.onclick = () => {
  zegoClient.stopPreview({});
};

// 开始推流
 publishStreamButton.onclick = () => {
	
  // 推流 主通道，屏幕分享的流
  // let ret = zegoClient.startPublishing({
  //   title: "screen",
  //   stream_id: TEST_PUB_SCREEN_STREAM_ID,
  //   publish_flag: ZEGOCONSTANTS.ZegoPublishFlag.ZEGO_JOIN_PUBLISH,
  //   params: "",
  //   channel_index: current_channel_index
  // });

  if(document.getElementById("publishStreamId").value != "")
  {
    TEST_PUB_STREAM_ID = document.getElementById("publishStreamId").value
  }

  // 推流第二通道，摄像头
  zegoClient.startPublishing({
 	 title: "camera",
 	 stream_id: TEST_PUB_STREAM_ID,
 	 publish_flag: ZEGOCONSTANTS.ZegoPublishFlag.ZEGO_JOIN_PUBLISH,
 	 params: "",
 	 channel_index: current_channel_index2
  });  
};

startRecordButton.onclick = () => {
	console.log("开始录制")
  zegoClient.startRecord({channel:0, record_type:3 , storage_path:"screen.mp4", record_format:2, is_fragment:true});
};

stopRecordButton.onclick = () => {
	console.log("停止录制")
  zegoClient.stopRecord({channel:0});
};


// 开始拉流播放
playStreamButton.onclick = () => {

  if(document.getElementById("playStreamId").value != ""){
    TEST_PLAY_STREAM_ID = document.getElementById("playStreamId").value;
  }
  zegoClient.startPlayingStream({
    stream_id: TEST_PLAY_STREAM_ID,
    canvas_view: document.getElementById("remoteVideo"),
    params: ""
  });

};

// 停止拉流
stopPlayButton.onclick = () => {
  zegoClient.stopPlayingStream({ stream_id: TEST_PLAY_STREAM_ID });
};

// 停止推流
stopPublishButton.onclick = () => {

  zegoClient.stopPublishing({ channel_index: current_channel_index });
  zegoClient.stopPublishing({ channel_index: current_channel_index2 });
  
  zegoClient.stopPreview({ channel_index: current_channel_index })
  zegoClient.stopPreview({ channel_index: current_channel_index2 })

};

// 退出房间
logoutRoomButton.onclick = () => {
  zegoClient.logoutRoom(rs => {});
};

// 反初始化sdk
uninitSdkButton.onclick = () => {
  zegoClient.unInitSDK();
};

sendMediaSideInfoButton.onclick = () => {
  zegoClient.activateMediaSideInfo({});
  zegoClient.sendMediaSideInfo({ side_info: "test side info message" });
};

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
    console.log("拉流失败,错误码为" + rs.error_code);
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
    console.log("推流失败,错误码为" + rs.error_code);
  }
});

// 流更新事件通知
zegoClient.onEventHandler("onStreamUpdated", rs => {
  console.log("流更新事件通知， onStreamUpdated, rs = ", rs);
  // add stream
  if (rs.stream_update_type == ZEGOCONSTANTS.ZegoStreamUpdateType.StreamAdded) {
    console.log("添加视频流，流列表为:", rs.stream_list);
  } else if (
    rs.stream_update_type == ZEGOCONSTANTS.ZegoStreamUpdateType.StreamDeleted
  ) {
    // remove stream
    console.log("移除了视频流，流列表为:", rs.stream_list);
  }
});

// 推流质量通知
zegoClient.onEventHandler("onPublishQualityUpdate", rs => {
  console.log("推流质量通知，onPublishQualityUpdate, rs = ", rs);
});
// 房间用户更新
zegoClient.onEventHandler("onUserUpdate", rs => {
  console.log("房间用户更新，onUserUpdate, rs = ", rs);
});
// 房间在线人数更新
zegoClient.onEventHandler("onUpdateOnlineCount", rs => {
  console.log("在线人数更新，onUpdateOnlineCount, rs = ", rs);
});
// 发送房间消息结果返回
zegoClient.onEventHandler("onSendRoomMessage", rs => {
  console.log("发送房间消息结果返回，onSendRoomMessage, rs = ", rs);
});
// 收到房间消息通知
zegoClient.onEventHandler("onRecvRoomMessage", rs => {
  console.log("收到房间消息通知，onRecvRoomMessage, rs = ", rs);
});
// 发送大房间消息结果返回
zegoClient.onEventHandler("onSendBigRoomMessage", rs => {
  console.log("发送大房间消息结果返回，onSendBigRoomMessage, rs = ", rs);
});
// 收到大房间消息通知
zegoClient.onEventHandler("onRecvBigRoomMessage", rs => {
  console.log("收到大房间消息通知，onRecvBigRoomMessage, rs = ", rs);
});
// 发送自定义消息结果返回
zegoClient.onEventHandler("onCustomCommand", rs => {
  console.log("发送自定义消息结果返回，onCustomCommand, rs = ", rs);
});
// 收到自定义消息通知
zegoClient.onEventHandler("onRecvCustomCommand", rs => {
  console.log("收到自定义消息通知，onRecvCustomCommand, rs = ", rs);
});
// 流额外信息更新通知
zegoClient.onEventHandler("onStreamExtraInfoUpdated", rs => {
  console.log("流额外信息更新通知，onStreamExtraInfoUpdated, rs = ", rs);
});
// 音频设备状态更新通知
zegoClient.onEventHandler("onAudioDeviceStateChanged", rs => {
  console.log("音频设备状态更新通知，onAudioDeviceStateChanged, rs = ", rs);
});
// 视频设备状态更新通知
zegoClient.onEventHandler("onVideoDeviceStateChanged", rs => {
  console.log("视频设备状态更新通知，onVideoDeviceStateChanged, rs = ", rs);
});
// 音量变更事件通知
zegoClient.onEventHandler("onAudioVolumeChanged", rs => {
  console.log("音量变更事件通知，onAudioVolumeChanged, rs = ", rs);
});
// 设备状态错误事件通知
zegoClient.onEventHandler("onDeviceError", rs => {
  console.log("设备状态错误事件通知，onDeviceError, rs = ", rs);
});
// 被挤掉线通知
zegoClient.onEventHandler("onKickOut", rs => {
  console.log("被挤掉线通知，onKickOut, rs = ", rs);
});
// 已从房间断开连接
zegoClient.onEventHandler("onDisconnect", rs => {
  console.log("已从房间断开连接,onDisconnect, rs = ", rs);
});
// 与 server 重连成功通知
zegoClient.onEventHandler("onReconnect", rs => {
  console.log("与 server 重连成功通知，onReconnect, rs = ", rs);
});
// 临时中断通知
zegoClient.onEventHandler("onTempBroken", rs => {
  console.log("临时中断通知，onTempBroken, rs = ", rs);
});
// 引擎结束停止通知
zegoClient.onEventHandler("onAVEngineStop", () => {
  console.log("引擎结束停止通知，onAVEngineStop");
});
// 录制状态回调
zegoClient.onEventHandler("onRecordStatusUpdate", rs => {
  console.log("录制状态回调，onRecordStatusUpdate, rs = ", rs);
});
// 收到媒体次要信息回调
zegoClient.onEventHandler("onRecvMediaSideInfo", rs => {
  console.log("收到媒体次要信息", rs);
});

zegoClient.onEventHandler("onVideoData", rs => {
  //console.log("onVideoData", rs);
});

const { remote } = require("electron");
const goButton = document.getElementById("go");

goButton.onclick = () => {
  remote
    .getCurrentWebContents()
    .loadURL(document.getElementById("urlContent").value);
};
