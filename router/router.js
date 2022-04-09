const express = require('express');
var router = express.Router();

// 导入控制器模块
const controller = require('../controller/controller.js')
const artController = require('../controller/artController.js')
const classifyController = require('../controller/classifyController.js')

//后台首页
router.get('/index',controller.index);
//后台登录页面
router.get('/login',controller.login);
//后台注册页面
router.get('/register',controller.register);
router.post('/add',controller.add);
router.post('/userLogin',controller.userLogin)

//后台文章页面
router.get('/article',artController.article);

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


module.exports = router