'use strict';
var fs = require('fs');
var url = require('url');
var path = require('path');
var http = require('http');

// 解析当前目录；
var root = path.resolve(process.argv[2]|| '.');

console.log('static root dir :',root);

var server = http.createServer(function(request,response){
    // 获得URL的path,类似 '/css/bootstrap.css':
    var pathname = url.parse(request.url).pathname;
    // 获得本地文件路径，类似 '/srv/www/css/bootstrap.css':
    var filepath = path.join(root,pathname);
    // 获取文件状态：
    fs.stat(filepath,function(err,stats){
        if(!err && stats.isFile()){
            // 没有出错且路径存在：
            console.log('200' + request.url);
            // 发送200 响应
            response.writeHead(200);
            // 将文件流导向response:
            fs.createReadStream(filepath).pipe(response);
        }else if(!err && stats.isDirectory()){
            fs.stat(path.join(filepath,'/index.html'),function(err,stats){
                if(!err && stats.isFile){
                    fs.createReadStream(path.join(filepath,'/index.html')).pipe(response);
                }
            })
        }else{
            // 出错了或者文件不存在
            console.log('404' + request.url);
            // 发送404响应
            response.writeHead(404);
            response.end('404 Not Found');
        }
    });
});

server.listen(8800);
console.log('Server is running at http://localhost:8800')