'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/lagou');

var db = mongoose.connection;

var LagouSchema = mongoose.Schema({
  name: String
});

var item_info = mongoose.model('item_info',LagouSchema,'item_info2'); // 集合的模型;

// var query = item_info.find({});


var callback = function(err,data){
  console.log('s')
  if(err){
    console.log(err);
  }else{
    console.log('data:',data);
  }
};

// query.where('createDate').gte('2016-11-1');


/**获取日期最近的job信息10条
 * 
 * 
 */
    var getLatest = async (ctx,next) =>{
        var query = item_info.find();

        query.sort('-createDate');
        query.limit(10);
        query.exec(callback);
        var callback = function(err,data){
            if(err){
                ctx.response.status = 500;
                return;
            }else{
                // console.log('query suc:getLast20',data);
                // ctx.response.type = 'application/json';
                ctx.response.status = 200;
                ctx.response.body = data;
                console.log(ctx)
            }
        }
        await query.exec(callback);
    }
    var test = async (ctx,next) =>{
        ctx.body = 'lalalalal';
        next();
    }
    var index = async (ctx,next) => {
        ctx.body = '欢迎你好';
    }

/**获取drilldown的数据信息
 * 
 */
// pipeline定义
let daily = {
    'dailyDistrict': [
        {'$group': {
            '_id': {'district': '$district', 'createDate': '$createDate'},
            'count': {'$sum': 1}
        }},
        {'$sort': {'count': -1}},
        {'$project': {
            'district': '$_id.district',
            'createDate': '$_id.createDate',
            'count': 1,
            '_id': 0
        }},
        {'$sort': {'createDate': -1}}
    ],
    'dailyCount': [
        {'$group': {
            '_id': '$createDate',
            'count': {'$sum': 1}
        }},
        {'$sort': {'_id': 1}}
    ]
}
    // 数据聚合
    let dailyDistrict = item_info.aggregate(daily.dailyDistrict).exec();
    let dailyCount = item_info.aggregate(daily.dailyCount).exec();

    // 转换外层统计数据 dailyCount
    function cookCount(arr){
        let output = [];
        for(let item of arr){
            let doc ={}
            doc.id=doc.name = item._id
            doc.y = item.count
            output.push(doc)
        }
        return output
    }

    /**
     * 传入两个数组，返回drilldown的数据系列
     * @Author   Zd
     * @DateTime 2016-12-18T02:27:58+0800
     * @param    {arr} count [cookCount的返回值]
     * @param    {arr} district [district的查询值]
     * @return   {[arr]} [装有obj的arr]
     */
    function cookDistrict(count,district){
        let output = []
        for(let item of count){
            let obj = {};
            obj.name = item.name;
            obj.id = item.id;
            obj.data = [];
            for(let info of district){
                let data = [];
                if(info.createDate === item.id){
                    data[0] = info.district || '无地区';
                    data[1] = info.count;
                    obj.data.push(data);
                }
            }
            output.push(obj)
        }
        return output
    }
var drilldownDaily = async (ctx,next) =>{
    dailyCount
    .then(arr => {
        let data = cookCount(arr)
        return data
    })
    .then(dailyCountData =>{
        dailyDistrict
        .then(dailyDistrictData => {
            let resault = cookDistrict(dailyCountData,dailyDistrictData)
            let finalData = {
                data:dailyCountData,
                drilldown:resault
            }
            ctx.status = 200;
            ctx.response.body = JSON.stringify(finalData);
            console.log(ctx);
        })
    })
    // ctx.status = 200;
    // ctx.response = 'nihaoya';
}



module.exports = {
    'GET /api/lagou': getLatest,
    'GET /api/test': test,
    // 'GET /':index
    'GET /api/drilldown':drilldownDaily
}


if(require.main===module){

    // dailyDistrict.then(function(){
    //     console.log(arguments)
    // });
    // dailyCount.then(i => {
    //     console.log(i)
    // });

}
