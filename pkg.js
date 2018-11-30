var arch = require('os').arch();
var exec = require('child_process').exec;
var os = require('os')
var platform = os.platform();

console.log("pkg ", platform, arch);

var change_deps_path_cmd = "install_name_tool -change @rpath/ZegoLiveRoomOSX.framework/ZegoLiveRoomOSX @rpath/../Resources/node_modules/zegoliveroom/ZegoLiveRoomOSX.framework/ZegoLiveRoomOSX ./node_modules/zegoliveroom/ZegoLiveRoom.node";
var restore_deps_path_cmd = "install_name_tool -change @rpath/../Resources/node_modules/zegoliveroom/ZegoLiveRoomOSX.framework/ZegoLiveRoomOSX @rpath/ZegoLiveRoomOSX.framework/ZegoLiveRoomOSX ./node_modules/zegoliveroom/ZegoLiveRoom.node";

if (platform == "darwin") {
    exec(change_deps_path_cmd, function (err, stdout, stderr) {
        if (err) {
            console.log('change deps path failed:', stderr);
        } else {
            console.log("change deps path successful");
        }
    });
}

exec("electron-builder --platform=" + platform + " --arch=" + arch, function (err, stdout, stderr) {
    if (err) {
        console.log('pkg failed:', stderr);
    } else {
        console.log("pkg successful");
    }
    if (platform == "darwin") {
        exec(restore_deps_path_cmd, function (err, stdout, stderr) {
            if (err) {
                console.log('restore deps path failed:', stderr);
            } else {
                console.log("restore deps path successful");
            }
        });
    }
});


