const express = require('express');
var router = express.Router();

// 导入控制器模块
const controller = require('../controller/controller.js')

//后台首页
router.get('/index',controller.index);
//后台登录页面
router.get('/login',controller.login);
//后台注册页面
router.get('/register',controller.register);
// router.get('/check',controller.check);
router.post('/add',controller.add);
router.post('/userLogin',controller.userLogin)


module.exports = router