const path = require('path');
const sysController = {};
const query = require('../model/query.js')

sysController.system = (req, res) => {
    res.render('system.html');
}

sysController.sysData = async (req, res) => {
    const sql = `select * from logo`
    let rows = await query(sql)
    const responseData = {
        data: rows,
        code: 0,
        msg: "success"
    }
    res.json(responseData)
 }

sysController.updSysData = async (req, res) => {
    let { val } = req.body
    const sql = `update logo set val = '${val}'`;
    const rows = await query(sql)
    res.json(rows)
}

//删除分类数据的接口
sysController.delSysData = async (req, res) => {
    let { data } = req.query
    console.log(data);
    const sql = `delete from logo where id=${data}`
    let rows = await query(sql)
    res.json(rows)
}
module.exports = sysController;