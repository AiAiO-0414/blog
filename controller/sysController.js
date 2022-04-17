const path = require('path');
const fs = require('fs');
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

sysController.updPic = async (req, res) => {
    const { id, isUpPic, oldPic } = req.body
    console.log(isUpPic);
    if (isUpPic == 1) {
        let files = req.files;  //获取上传文件的数据                
        let { filename, originalname } = files[0];
        let oldPic = JSON.parse(req.cookies.logoPic)
        console.log(oldPic);
        pic = `${files[0].originalname}`
        PicPath = path.join(path.dirname(__dirname), `/upload/${oldPic}`)
        console.log(PicPath);
        fs.unlink(PicPath, (err) => { })
        //文件重命名
        fs.renameSync(path.join(`${path.dirname(__dirname)}/upload/${filename}`), path.join(`${path.dirname(__dirname)}/upload/${originalname}`));
        sql = `update logo set Logo='${pic}' where id = 1 `;
        await query(sql);
        res.cookie('logoPic', JSON.stringify(pic), {
            expires: new Date(Date.now() + 1 * 3600000),
        })
        res.json({
            code: 0,
            message: '上传成功'
        })
    } else {
        res.json({
            code: 1,
            message: '上传失败'
        })
    }


    // if (affectedRows > 0) {

    // } else {

    // }

}
module.exports = sysController;