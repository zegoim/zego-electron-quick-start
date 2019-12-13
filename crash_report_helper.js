
const { app } = require('electron')
const electron = require('electron')
const fs = require('fs');
const path = require('path')
var archiver = require('archiver');
var FormData = require('form-data')
var http = require('http')
var https = require('https')


var form = new FormData({ maxDataSize: 20971520 });

module.exports = {

    // 发生崩溃时生成dmp文件。如果不调用本函数，则崩溃时不会产生崩溃文件
    // 生成的路径为 tmp 目录下，带Crashes目录的文件夹内: app.getPath("temp") + "/" + app.getName() + " Crashes"
    genDmpFileIfCrashed: function () {
        electron.crashReporter.start({
            companyName: '',
            submitURL: "",
            uploadToServer: false // 不自动提交，捕获到崩溃后，程序打包崩溃文件和日志文件然后在自己提交
        })
    },
    
    // 查找dir目录下后缀名为.dmp的文件
    // 不递归查找子目录
    findAllDmpFiles: function (dir) {
        try {
            var results = []
            var list = fs.readdirSync(dir)
            list.forEach(function (file) {
                file = dir + '/' + file
                var stat = fs.statSync(file)
                if (stat && !stat.isDirectory() && path.extname(file) == ".dmp") {
                    results.push(file)
                }
            })
            return results
        } catch (err) {
            return []
        }
    },
    // 查找zego的日志文件
    // dir - zego sdk 的日志位置，填写通过setLogDir设置的日志路径
    findZegoLogs: function (dir) {
        try {
            var results = []
            var list = fs.readdirSync(dir)
            list.forEach(function (file) {
                if (file == "zegoavlog1.txt"
                    || file == "zegoavlog2.txt"
                    || file == "zegoavlog3.txt"
                    || file == "zegoscreencaplog1.txt"
                    || file == "zegoscreencaplog2.txt"
                    || file == "zegoscreencaplog3.txt") {
                    file = dir + '/' + file
                    results.push(file)
                }
            })
            return results
        } catch (err) {
            return []
        }
    },
    // 压缩文件为zip
    // src_file_list - 要压缩的源文件数组
    // output_zip_file - 压缩后的压缩包文件路径带文件名
    // call_back - 压缩结束回调 0 - 成功 ， -1 失败
    archiverFiles: function (src_file_list, output_zip_file, call_back) {
        var output = fs.createWriteStream(output_zip_file);
        var archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });
        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', function () {
            //console.log(archive.pointer() + ' total bytes');
            //console.log('archiver has been finalized and the output file descriptor has closed.');
            if (call_back) {
                call_back(0)
            }            
        });

        // This event is fired when the data source is drained no matter what was the data source.
        // It is not part of this library but rather from the NodeJS Stream API.
        // @see: https://nodejs.org/api/stream.html#stream_event_end
        output.on('end', function () {
            console.log('Data has been drained');
            if (call_back) {
                call_back(-1)
            }
        });

        // good practice to catch warnings (ie stat failures and other non-blocking errors)
        archive.on('warning', function (err) {
            if (err.code === 'ENOENT') {
                // log warning
            } else {
                if (call_back) {
                    call_back(-1)
                }
            }
        });

        // good practice to catch this error explicitly
        archive.on('error', function (err) {
            
            if (call_back) {
                call_back(-1)
            }
        });

        // pipe archive data to the file
        archive.pipe(output);

        // append a file from stream
        for (i in src_file_list) {
            var file = src_file_list[i];
            archive.append(fs.createReadStream(file), { name: path.basename(file) });
        }
        archive.finalize();

    },

    // file_to_upload - 要上传的dmp和日志文件
    // protocol - http: 或者https:
    // host - breakpad 服务器ip或者域名
    // port - breakpad 服务器端口
    // path - 服务请求路径
    // call_back - 上传结束回调 0 - 成功 ， -1 失败
    uploadToBreakPadServer: function (file_to_upload, protocol, host, port, path, call_back) {

        form.append('upload_file_minidump', fs.createReadStream(file_to_upload), 'dmpfile');
        form.append('_companyName', '');              // 公司名字
        form.append('_productName', app.getName());   // App 产品名字
        form.append('ver', process.versions.electron);// Electron 版本号
        form.append('_version', app.getVersion());    // App 版本号
        form.append('platform', process.platform);    // 平台信息
        form.append('comments', "dmp file and log zip file");  // 注释信息

        var http_module = http
        if (protocol == "http:") {
            http_module = http
        } else {
            http_module = https
        }
        try
        {
        var request = http_module.request(
            {
                method: 'post',
                protocol: protocol,
                host: host,
                port: port,
                path: path,
                headers: form.getHeaders()
            }
        )

        form.pipe(request)

        request.on('response', function (res) {
            console.log(res.statusCode);
            if (res.statusCode == 200) {
                if (call_back) {
                    call_back(0)
                }
            } else {
                if (call_back) {
                    call_back(-1)
                }
            }
        });            
            
        }catch(err)
        {
            console.log(err)
        }

    },

    // 删除文件
    // file_path - 要删除的文件路径
    removeFile: function (file_path) {
        fs.unlink(file_path, (err) => {
            if (err) throw err;
            //console.log('successfully deleted ', del_file);
        });
    },

    // dmp_file_dir - dmp 目录 Electron 生成dmp文件的目录默认为 app.getPath("temp") + "/" + app.getName() + " Crashes"
    // zego_log_dir - zego sdk log 目录，要与setLogDir一致
    // tmp_zip_path - 临时压缩包文件，压缩dmp文件和日志文件的压缩包
    // upload_server.protocol  - 服务器的协议 http: 或者 https:
    // upload_server.host  - 服务器ip或者域名
    // upload_server.port  - 服务器端口号
    // upload_server.path  - 服务路径
    searchDmpFileAndUpload : function({dmp_file_dir, zego_log_dir, tmp_zip_path, upload_server/*:{ protocol, host, port, path }*/})
    {
        // 查找dmp文件
        dmp_file_lists = this.findAllDmpFiles(dmp_file_dir);
        
        if(dmp_file_lists.length <= 0)
        {
            // 没有dmp文件不处理
            return;
        }

        zego_log_lists = this.findZegoLogs(zego_log_dir)

        // 用户需要 把 dmp_file_lists 和 zego_log_lists的文件上传到服务器
        // 上传成功后，把本地dmp文件文件删除掉（即遍历dmp_file_lists 删除所有dmp文件）
        // 压缩 dmp_file_lists 和 zego_log_lists 后上传
        output_to_zip_files = dmp_file_lists.concat(zego_log_lists)
        
        server_config = upload_server

        //压缩dmp文件和日志文件
        this.archiverFiles(output_to_zip_files, tmp_zip_path , (function (error) {
            if (error == 0) {
                // 上传压缩后的dmp文件和日志文件
                this.uploadToBreakPadServer(tmp_zip_path, server_config.protocol, server_config.host, server_config.port, server_config.path, (function (error_code) {
                    if (error_code == 0) {
                        // 上传成功后删除本地的dmp文件和日志文件
                        this.removeFile(tmp_zip_path)
                        for (i in output_to_zip_files) {
                            this.removeFile(output_to_zip_files[i])
                        }
                    }
                }).bind(this))
            }
        }).bind(this))
    }
}
