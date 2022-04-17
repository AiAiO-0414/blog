const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const express_template = require('express-art-template');
require('dotenv').config()
const cookieParser = require('cookie-parser')
const session = require('express-session')
const fontRouter = require('./router/fontRouter.js')
app.use(cors())
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
        maxAge: 60000 * 240, // 设置有效期为24分钟,如果24分钟内访问了,则有效期重新初始化为24分钟。
    }
}))

app.use('/assets',express.static(path.join(__dirname,'assets')))
app.use('/upload',express.static(path.join(__dirname,'upload')))


// 注册前台路由
app.use('/api', fontRouter)

app.use((req,res,next)=>{
    let reqPath = req.path
    const noPath = ['/login','/userLogin','/register','/add']
    if(noPath.includes(reqPath)){
        next();   //放行
    }else{
        if(req.session.userInfo){
            next();
        }else{
            res.redirect('/login')
            return
        }
    }
})

//配置模板的路径
app.set('views', __dirname + '/views/');
//设置express_template模板后缀为.html的文件(不设这句话，模板文件的后缀默认是.art)
app.engine('html', express_template); 
//设置视图引擎为上面的html
app.set('view engine', 'html');

//导入路由中间件
const router = require('./router/router.js');
app.use(router)


app.listen(process.env.PORT,()=>{
    console.log('服务器已启动');
})