

在13行 填写 zego appid

在15行 填写 zego app_sign

在96行填写FaceUnity 的license、指定 v3.bundle 文件的路径，face_beautification.bundle 文件的路径

然后执行以下命令

```
cnpm install

```

安装完依赖后，拷贝三个插件
```
libsgemm.dll
nama.dll
ZegoVideoFilter.node
```

文件到node_modules/zegoliveroom 目录下


最后，执行以下运行Demo
```
npm start
```

运行起来后，依次点击：

初始化sdk --> 登录房间 --> 开始预览 --> 调节美颜等级 --> 开始推流 --> 开始拉流