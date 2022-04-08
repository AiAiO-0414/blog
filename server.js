const express = require('express');
const path = require('path');
const app = express();
const artTemplate = require('art-template'); 
const express_template = require('express-art-template');
require('dotenv').config()
const cookieParser = require('cookie-parser')
const session = require('express-session')
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cookieParser())

// 初始化session相关配置
app.use(session({
    name: 'session_id',
    secret: "dsu#$^*(&134",  //加密
    cookie: {
        httpOnly: true,
        maxAge: 60000 * 24, // 设置有效期为24分钟,如果24分钟内访问了,则有效期重新初始化为24分钟。
    }
}))

//配置模板的路径
app.set('views', __dirname + '/views/');
//设置express_template模板后缀为.html的文件(不设这句话，模板文件的后缀默认是.art)
app.engine('html', express_template); 
//设置视图引擎为上面的html
app.set('view engine', 'html');

//导入路由中间件
const router = require('./router/router.js');
app.use(router)

app.use('/assets',express.static(path.join(__dirname,'assets')))

app.listen(process.env.PORT,()=>{
    console.log('服务器已启动');
})