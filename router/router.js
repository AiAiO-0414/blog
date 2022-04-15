const express = require('express');
const app = express();
const path = require('path');
var router = express.Router();
const multer = require('multer');   


// 导入控制器模块
const controller = require('../controller/controller.js')
const artController = require('../controller/artController.js')
const classifyController = require('../controller/classifyController.js')
const sysController = require('../controller/sysController.js')
router.use(multer({ dest: './upload/' }).array('file'))

//后台首页
router.get('/index',controller.index);

//后台登录页面
router.get('/login',controller.login);
router.get('/logoData',controller.logoData);

//后台注册页面
router.get('/register',controller.register);
router.post('/add',controller.add);
router.post('/userLogin',controller.userLogin)

//后台退出功能
router.post('/logout',controller.logout)
//后台展示个人信息功能
router.post('/updUserInfo',controller.updUserInfo)
router.post('/upAvatar',controller.upAvatar)
//后台修改密码功能
router.post('/change',controller.change)



//后台文章页面
router.get('/article',artController.article);
router.get('/artData',artController.artData);
router.get('/addArticle',artController.addArticle);
router.post('/addArtData',artController.addArtData);
router.post('/delArtData',artController.delArtData);


//后台分类列表
router.get('/classify',classifyController.classify);
// 分类列表数据接口
router.get('/cateData', classifyController.cateData)
//分类列表更新数据接口
router.post('/updCateData', classifyController.updCateData)
//分类列表删除数据接口
router.get('/delCateData', classifyController.delCateData)
//分类列表添加数据接口
router.get('/addCate', classifyController.addCate)
router.post('/addCateData', classifyController.addCateData)
router.get('/getCount',classifyController.getCount);


//系统设置列表
router.get('/system',sysController.system)
router.get('/sysData',sysController.sysData)
router.post('/updSysData', sysController.updSysData)
router.get('/delSysData', sysController.delSysData)




module.exports = router