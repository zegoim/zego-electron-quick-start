

在13行 填写 zego appid

在15行 填写 zego app_sign

在96行填写FaceUnity 的license、指定 [v3.bundle](https://github.com/zegoim/faceunity-electron-addon/tree/master/sdk/fusdk/assets) 文件的路径，[face_beautification.bundle](https://github.com/zegoim/faceunity-electron-addon/tree/master/sdk/fusdk/assets) 文件的路径


然后执行以下命令

```
cnpm install
```

安装完依赖后，先编译插件，插件工程和编译说明参考：[仓库链接](https://github.com/zegoim/faceunity-electron-addon)

编译完插件后，如果是windows平台，拷贝三个插件文件到node_modules/zegoliveroom 目录下。
```
libsgemm.dll
nama.dll
ZegoVideoFilter.node
```

如果是Mac平台，拷贝ZegoVideoFilter.node 到node_modules/zegoliveroom 目录下即可。


最后，执行以下运行Demo
```
npm start
```

运行起来后，依次点击：

初始化sdk --> 登录房间 --> 开始预览 --> 调节美颜等级 --> 开始推流 --> 开始拉流

精细控制其他美颜参数，调节相关的按钮参数即可。

相关美颜参考
    
http://www.faceunity.com/

https://github.com/Faceunity/FULivePC/blob/master/docs/Beautification_Filters_User_Specification.md

https://github.com/Faceunity/FULivePC/blob/master/docs/%E7%BE%8E%E9%A2%9C%E9%81%93%E5%85%B7%E5%8A%9F%E8%83%BD%E6%96%87%E6%A1%A3.md
    

