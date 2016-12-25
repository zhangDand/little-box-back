const path = require('path');
const fs = require('mz/fs');

function randomPage(arr,num){ // 从传入的列表中随机返回
    var result = [];
    // let count = Math.ceil(Math.random()*num);
    let count = -(-num);
    for(var i=0;i<count;i++){
        console.log(i);
        var index = Math.ceil(Math.random()*19);
        result.push(arr[index])
    }
    console.log(result.length)
    return result;
}
async function getImg(ctx,next){
    let sp = path.resolve('/littlebox/static/img');
    let imgs =await fs.readdir(sp);
    let imgps = imgs.map( (file,index,arr) => {
        return path.join('/static/img',file);
    });
    let num = ctx.request.query.number || 20;
    ctx.response.status = 200;
    ctx.response.body = randomPage(imgps,num);
    ctx.response.set('Access-Control-Allow-Origin','*')
}


module.exports = {
    'GET /api/imgs': getImg,
};
