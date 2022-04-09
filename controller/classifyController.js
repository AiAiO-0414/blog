const path = require('path');
const classifyController = {};
//导入模块
const query = require('../model/query.js')

classifyController.classify = (req, res) => {
    res.render('classify.html');
}

classifyController.addCate = async(req,res) =>{
    res.sendFile(path.join(__dirname,'../views/addCate.html'))
}

//获取分类的接口数据
classifyController.cateData = async (req, res) => {
    const sql = `select * from category`
    const rows = await query(sql)
    const responseData = {
        data: rows,
        code: 0,
        msg: "success"
    }
    res.json(responseData)
}
//更新分类的接口数据
classifyController.updCateData = async (req, res) => {
    let { cate_id, cate_name, orderBy } = req.body
    const sql = `update category set cate_name = '${cate_name}',orderBy = ${orderBy} where cate_id = ${cate_id}`;
    const rows = await query(sql)
    res.json(rows)
}

//删除分类数据的接口
classifyController.delCateData = async (req, res) => {
    let { data } = req.query
    const sql = `delete from category where cate_id=${data}`
    let rows = await query(sql)
    res.json(rows)
}

//添加分类数据的接口
classifyController.addCateData = async (req, res) => {
    let { data } = req.body
    const sql = `insert into category(cate_name,orderBy) values('${data.cate_name}','${data.orderBy}')`;
    const rows = await query(sql)
    res.json(rows)
}



module.exports = classifyController;