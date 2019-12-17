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

// const getVersionButton = document.getElementById("getVersion");
// const initButton = document.getElementById("init");
const loginButton = document.getElementById("login");
// const selectVideoDeviceButton = document.getElementById("selectVideoDevice");
// const previewButton = document.getElementById("preview");
// const publishStreamButton = document.getElementById("publishStream");
// const playStreamButton = document.getElementById("playStream");
// const stopPlayButton = document.getElementById("stopPlay");
// const startRecordButton = document.getElementById("startRecord");
// const stopRecordButton = document.getElementById("stopRecord");
// const stopPublishButton = document.getElementById("stopPublish");
const logoutButton = document.getElementById("logout");
// const uninitSdkButton = document.getElementById("uninitSdk");
// const sendMediaSideInfoButton = document.getElementById("sendMediaSideInfo");

// // gen randow word
// function randomWord(len) {
//   let str = "",
//     arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
//   for (let i = 0; i < len; i++) {
//     let pos = Math.round(Math.random() * (arr.length - 1));
//     str += arr[pos];
//   }
//   return str;
// }

// // 用户id
// const TEST_USER_ID = "test_user_id" + randomWord(5);
// // 用户名字
// const TEST_USER_NAME = "test_user_name" + randomWord(5);
// // 房间id
// const TEST_ROOM_ID = "test_room_id" + randomWord(5);
// // 房间名字
// const TEST_ROOM_NAME="test_room_name" + randomWord(5);
// // 推流的流id
// const TEST_PUB_STREAM_ID = "test_stram_id" + randomWord(5);
// // 拉流的流id
// const TEST_PLAY_STREAM_ID = TEST_PUB_STREAM_ID;

// // 获取版本号
// getVersionButton.onclick = () => {
//   document.getElementById("sdkversiontext").innerText = zegoClient.getSDKVersion();
// }

// // 初始化sdk
// initButton.onclick = () => {

//   // 从官网申请的 AppID 默认是测试环境，而 SDK 初始化默认是正式环境，所以需要在初始化 SDK 前设置测试环境，否则 SDK 会初始化失败，当 App 集成完成后，再向 ZEGO 申请开启正式环境。
//   // 配置设置当前环境为测试环境
//   zegoClient.setUseEnv({ use_test_env: true }); // 注意：上线前需切换为正式环境运营。

//   // 初始化sdk
//   let ret = zegoClient.initSDK({
//     app_id: app_id,
//     sign_key: app_sign,
//     user_id: TEST_USER_ID,
//     user_name: TEST_USER_NAME
//   }, rs => {
//     if (rs.error_code == 0) {
//       console.log("sdk初始化成功");

//     } else {
//       console.log("sdk初始化失败,错误码为：" + rs.error_code);
//       zegoClient.unInitSDK();
//     }
//   });
//   if (ret) {
//     console.log("正在初始化...");
//   } else {
//     console.log("sdk初始化失败");
//     zegoClient.unInitSDK();
//   }
// }

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

let userRole = ""           // 当前用户角色
let classroomID = "";       // 房间号
let userID = ""             // 当前用户的ID 老师角色下：teacher+3位随机数 学生角色下：student+3位随机数
let streamList = []         // 当前房间类的远端流列表


function startPublish() {
    // 预览视频 绑定至canvasLocal
    let previewCanvas = userRole == "teacherRole"?  document.getElementById("teacherRoleCanvasLocal"): document.getElementById("studentRoleCanvasLocal");

    let set_ret = zegoClient.setPreviewView({
        canvas_view: previewCanvas,
        channel_index: ZEGOCONSTANTS.PublishChannelIndex.PUBLISH_CHN_MAIN
    });
    if (set_ret) {
        let preview_ret = zegoClient.startPreview({
            channel_index: ZEGOCONSTANTS.PublishChannelIndex.PUBLISH_CHN_MAIN
        });
        console.log("预览结果", preview_ret);
    }

    // 开始推流
    let ret = zegoClient.startPublishing({
        stream_id: userID,
        publish_flag: ZEGOCONSTANTS.ZegoPublishFlag.ZEGO_JOIN_PUBLISH,
        params: ""
    });
}

function stopPublish() {
    zegoClient.stopPreview()
    zegoClient.stopPublish();
}

function startPlay(streamID, canvas) {
    zegoClient.startPlayingStream({
        stream_id: streamID,
        canvas_view: canvas,
        params: ""
    });
}

function stopPlay(streamID) {
    zegoClient.stopPlayingStream(streamID);
}

function loginRoom(classroomID) {
    let ret = zegoClient.loginRoom({
        room_id: classroomID,
        room_name: classroomID,
        role: ZEGOCONSTANTS.ZegoRoomRole.Audience
    }, rs => {
        console.log("登录结果返回 ", rs);
        if (rs.error_code == 0) {
            console.log("登录成功");
            startPublish();
            streamList = rs.stream_list;
            updatePlay();
        } else {
            console.log("登录失败，错误码为：" + rs.error_code);
        }
    });
}

function initAndLogin(userID, classroomID) {
    // 先初始化
    zegoClient.setUseEnv({ use_test_env: true });

    // 初始化sdk
    let ret = zegoClient.initSDK({
        app_id: app_id,
        sign_key: app_sign,
        user_id: userID,
        user_name: userID
    }, rs => {
        if (rs.error_code == 0) {
            console.log("sdk初始化成功");
            loginRoom(classroomID);
        } else {
            console.log("sdk初始化失败,错误码为：" + rs.error_code);
            zegoClient.unInitSDK();
        }
    });
    if (!ret) {
        console.log("sdk初始化失败");
        zegoClient.unInitSDK();
    }
}




// // 选择摄像头设备
// selectVideoDeviceButton.onclick = () => {
//   // 获取摄像头设备列表
//   let video_devices_list = zegoClient.getVideoDeviceList();
//   console.log("got video devices list:", video_devices_list);
//   if(video_devices_list.length > 0){
//     let cur_sel_index = 0; // 设备索引，选择第一个设备
//     zegoClient.setVideoDevice({
//       device_id: video_devices_list[cur_sel_index].device_id 
//     });
//   }
// }

// // 预览本地摄像头
// previewButton.onclick = () => {
//   // 预览视频
//   let set_ret = zegoClient.setPreviewView({
//     canvas_view: document.getElementById("localVideo"),
//     channel_index: ZEGOCONSTANTS.PublishChannelIndex.PUBLISH_CHN_MAIN
//   });
//   if (set_ret) {
//     let preview_ret = zegoClient.startPreview({
//       channel_index: ZEGOCONSTANTS.PublishChannelIndex.PUBLISH_CHN_MAIN
//     });
//     console.log("预览结果", preview_ret);

//     // 开启回音消除
//     zegoClient.enableAEC({enable:true});

//     // 开启噪音消除
//     zegoClient.enableANS({enable:true});

//     // 开启增益
//     zegoClient.enableAGC({enable:true});    

//   }
// }

// // 开始推流
// publishStreamButton.onclick = () => {
//   // 开始推流
//   let ret = zegoClient.startPublishing({
//     title: "zego electron simple test xx",
//     stream_id: TEST_PUB_STREAM_ID,
//     publish_flag: ZEGOCONSTANTS.ZegoPublishFlag.ZEGO_JOIN_PUBLISH,
//     params: ""
//   });
// }

// // 开始拉流播放
// playStreamButton.onclick = () => {
//   zegoClient.startPlayingStream({
//     stream_id: TEST_PLAY_STREAM_ID,
//     canvas_view: document.getElementById("remoteVideo"),
//     params: ""
//   });
// }

// // 停止拉流
// stopPlayButton.onclick = () => {
//   zegoClient.stopPlayingStream({ stream_id: TEST_PLAY_STREAM_ID });
// }

// // 停止推流
// stopPublishButton.onclick = () => {
//   zegoClient.stopPublishing({ channel_index: ZEGOCONSTANTS.PublishChannelIndex.PUBLISH_CHN_MAIN });
// }

function logoutAndUninit() {
    zegoClient.logoutRoom(rs => {
        console.log("logout: ", rs)
        zegoClient.unInitSDK();
    });
}


// sendMediaSideInfoButton.onclick = () => {
//     zegoClient.activateMediaSideInfo({});
//     zegoClient.sendMediaSideInfo({side_info:"test side info message"});

// }


// // SDK 引擎事件通知
// zegoClient.onEventHandler("onAVKitEvent", rs => {
//   console.log("SDK 引擎事件通知，onAVKitEvent, rs = ", rs);
//   // EventType:
//   // {
//   //     Play_BeginRetry: 1,        /**< 开始重试拉流 */
//   //     Play_RetrySuccess: 2,      /**< 重试拉流成功 */
//   //     Publish_BeginRetry: 3,     /**< 开始重试推流 */
//   //     Publish_RetrySuccess: 4,   /**< 重试推流成功 */
//   //     Play_TempDisconnected: 5,     /**< 拉流临时中断 */
//   //     Publish_TempDisconnected: 6,  /**< 推流临时中断 */
//   //     Play_VideoBreak: 7,           /**< 拉流卡顿(视频) */
//   // }
// });


// // 拉流状态通知
// zegoClient.onEventHandler("onPlayStateUpdate", rs => {
//   console.log("拉流状态通知，onPlayStateUpdate, rs = ", rs);
//   if (rs.error_code == 0) {
//     console.log("拉流成功, 流id=" + rs.stream_id);
//   } else {
//     // 错误码
//     //  = 0        拉流成功 , 其它错误码 查看官网错误码列表 https://doc.zego.im/API/HideDoc/ErrorCodeTable.html
//     console.log('拉流失败,错误码为' + rs.error_code);
//   }
// });

// // 拉流质量更新事件通知
// zegoClient.onEventHandler("onPlayQualityUpdate", rs => {
//   console.log("拉流质量更新事件通知，onPlayQualityUpdate, rs = ", rs);
// });


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
    rs.stream_list.forEach(stream => {
        const streamIds = streamList.map(stream => stream.stream_id);
        const startIndex = streamIds.indexOf(stream.stream_id);

        if (rs.stream_update_type == ZEGOCONSTANTS.ZegoStreamUpdateType.StreamAdded && startIndex < 0) {
            streamList.push(stream);
        }
        if (rs.stream_update_type == ZEGOCONSTANTS.ZegoStreamUpdateType.StreamDeleted && startIndex > -1) {
            stopPlay(stream.stream_id);
            streamList.splice(startIndex, 1);
        }
    })
    console.log("现在的流列表有：", JSON.stringify(streamList));
    updatePlay();
});

function updatePlay() {
    if (userRole == "teacherRole") {
        streamList.forEach((stream, index) => {
            let canvasRemote = document.getElementById("teacherRoleCanvasRemote" + index);
            if (canvasRemote) {
                startPlay(stream.stream_id, canvasRemote);
            }
        });
    }
    else{
        console.log("updatePlay studentRole")
        streamList.forEach((stream, index) => {
            if(stream.stream_id.startsWith("teacher-")){
                let canvasRemote = document.getElementById("studentRoleCanvasRemote" + index);
                if (canvasRemote) {
                    startPlay(stream.stream_id, canvasRemote);
                }
            }
        });
    }
}


// // 推流质量通知
// zegoClient.onEventHandler("onPublishQualityUpdate", rs => { console.log("推流质量通知，onPublishQualityUpdate, rs = ", rs); });
// // 房间用户更新
// zegoClient.onEventHandler("onUserUpdate", rs => { console.log("房间用户更新，onUserUpdate, rs = ", rs); });
// // 房间在线人数更新
// zegoClient.onEventHandler("onUpdateOnlineCount", rs => { console.log("在线人数更新，onUpdateOnlineCount, rs = ", rs); });
// // 发送房间消息结果返回
// zegoClient.onEventHandler("onSendRoomMessage", rs => { console.log("发送房间消息结果返回，onSendRoomMessage, rs = ", rs); });
// // 收到房间消息通知
// zegoClient.onEventHandler("onRecvRoomMessage", rs => { console.log("收到房间消息通知，onRecvRoomMessage, rs = ", rs); });
// // 发送大房间消息结果返回
// zegoClient.onEventHandler("onSendBigRoomMessage", rs => { console.log("发送大房间消息结果返回，onSendBigRoomMessage, rs = ", rs); });
// // 收到大房间消息通知
// zegoClient.onEventHandler("onRecvBigRoomMessage", rs => { console.log("收到大房间消息通知，onRecvBigRoomMessage, rs = ", rs); });
// // 发送自定义消息结果返回
// zegoClient.onEventHandler("onCustomCommand", rs => { console.log("发送自定义消息结果返回，onCustomCommand, rs = ", rs); });
// // 收到自定义消息通知
// zegoClient.onEventHandler("onRecvCustomCommand", rs => { console.log("收到自定义消息通知，onRecvCustomCommand, rs = ", rs); });
// // 流额外信息更新通知
// zegoClient.onEventHandler("onStreamExtraInfoUpdated", rs => { console.log("流额外信息更新通知，onStreamExtraInfoUpdated, rs = ", rs); });
// // 音频设备状态更新通知
// zegoClient.onEventHandler("onAudioDeviceStateChanged", rs => { console.log("音频设备状态更新通知，onAudioDeviceStateChanged, rs = ", rs); });
// // 视频设备状态更新通知
// zegoClient.onEventHandler("onVideoDeviceStateChanged", rs => { console.log("视频设备状态更新通知，onVideoDeviceStateChanged, rs = ", rs); });
// // 音量变更事件通知
// zegoClient.onEventHandler("onAudioVolumeChanged", rs => { console.log("音量变更事件通知，onAudioVolumeChanged, rs = ", rs); });
// // 设备状态错误事件通知
// zegoClient.onEventHandler("onDeviceError", rs => { console.log("设备状态错误事件通知，onDeviceError, rs = ", rs); });
// // 被挤掉线通知
// zegoClient.onEventHandler("onKickOut", rs => {console.log("被挤掉线通知，onKickOut, rs = ", rs);});
// // 已从房间断开连接
// zegoClient.onEventHandler("onDisconnect", rs => { console.log("已从房间断开连接,onDisconnect, rs = ", rs);});
// // 与 server 重连成功通知
// zegoClient.onEventHandler("onReconnect", rs => { console.log("与 server 重连成功通知，onReconnect, rs = ", rs); });
// // 临时中断通知
// zegoClient.onEventHandler("onTempBroken", rs => { console.log("临时中断通知，onTempBroken, rs = ", rs); });
// // 引擎结束停止通知
// zegoClient.onEventHandler("onAVEngineStop", () => { console.log("引擎结束停止通知，onAVEngineStop"); });
// // 录制状态回调
// zegoClient.onEventHandler("onRecordStatusUpdate", rs => {
//   console.log("录制状态回调，onRecordStatusUpdate, rs = ", rs);
// });
// // 收到媒体次要信息回调
// zegoClient.onEventHandler("onRecvMediaSideInfo", rs => {console.log("收到媒体次要信息", rs);})

// 登陆房间
loginButton.onclick = () => {
    console.log("login clicked")

    userRole = document.getElementById("radioTeacher").checked ? "teacherRole" : "studentRole";
    classroomID = document.getElementById("inputClassroomID").value === ""?  "smallClass-1": document.getElementById("inputClassroomID").value;
    userID = userRole == "teacherRole"? "teacher-" + randomWord(3): "student-" + randomWord(3);

    if(userRole === "teacherRole"){
        $("#divClassForTeacherRole").css("display", "block");
        $("#divOperator").css("display", "block");
    }else{
        $("#divClassForStudentRole").css("display", "block");
        $("#divOperator").css("display", "block");
    }

    initAndLogin(userID, classroomID);
}

// 退出房间
logoutButton.onclick = () => {
    logoutAndUninit();
    openModel();
}

function openModel() {
    $("#divClassForTeacherRole").css("display", "none");
    $("#divClassForStudentRole").css("display", "none");
    $("#divOperator").css("display", "none");
    $('#myModal').modal({ backdrop: 'static', keyboard: false });
    $('#myModal').modal("show");
}

$(document).ready(function () {
    openModel()
});