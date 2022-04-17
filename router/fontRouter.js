var express = require('express')
var router = express.Router()

// 导入Home控制器
const fontController = require('../controller/fontController.js')
router.get('/cate', fontController.cate)
router.get('/artData', fontController.artData)
router.get('/CatesData', fontController.CatesData)
router.get('/OneArt', fontController.OneArt)

module.exports = router;