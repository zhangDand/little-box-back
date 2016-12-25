const Koa = require('koa');

const staticFile = require('./static-file.js');
const router = require('koa-router')();
const bodyparser = require('koa-bodyparser');
const controllor = require('./controller.js');
const {compress} = require('koa-middleware');
const cors = require('koa-cors');


const app = new Koa();
app.use(cors());
app.use(compress(
    // {
    //     threshold: 2048,
    //     flush: require('zlib').Z_SYNC_FLUSH
    // }
));
app.use(staticFile('/static/',__dirname+'/static'));
app.use(bodyparser());
// app.use(async (ctx,next) => {
//     if
// })
app.use(controllor());


// app.use(async (ctx,next) => {
//     await next();
//     ctx.response.type = 'text/html';
//     ctx.response.body = '累好呀！！~'
// })

app.listen(80);
console.log('app started at port 3000....')