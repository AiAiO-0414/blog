const path = require('path');
const fs = require('fs');
const moment = require('moment');
const artController = {};
//导入模块
const query = require('../model/query.js')
artController.article = (req, res) => {
    res.render('article.html');
}

artController.addArticle = (req, res) => {
    res.render('addArticle.html');
}

artController.editArticle = (req, res) => {
    res.render('editArticle.html');
}

artController.artData = async (req, res) => {
    //1.接收页码和显示的条数
    const { page, limit, keyword } = req.query
    //2.查询总条数并解构
    let sql = `select count(id) as count from article where 1`
    if (keyword) {
        sql += ` and title like '%${keyword}%'`
    }
    const result = await query(sql)
    const { count } = result[0]
    //3.根据page和limit获取指定页码的数据,（当前页-1）* 每页显示的条数
    const offset = (page - 1) * limit
    let sql2 = `select t1.*,t2.cate_name,t3.username from article t1 
    left join category t2 on t1.cate_id = t2.cate_id 
    left join users t3 on t1.author = t3.id 
    where 1`
   
    if (keyword) {
        sql2 += ` and title like '%${keyword}%'`
    }
    sql2 += ` order by t1.id desc limit ${offset},${limit}`

    let data = await query(sql2)
    data = data.map((item) => {
        const {
            status,
            cate_name,
            username
        } = item;
        let add_date = Date.now();
        item.statusText = status == 1 ? '审核通过' : "审核中"
        item.cate_name = cate_name || '未分类'
        item.username = username || '神秘人'
        item.add_date = moment(add_date).format('YYYY-MM-DD')
        return item;
    })
    // 4. 响应数据
    res.json({
        count,
        data,
        code: 0,
        msg: "success"
    })
}

artController.addArtData = async (req, res) => {
    const { id, title, content, status, cate_id } = req.body
    const add_date = moment().format('YYYY-MM-DD')
    const author = req.session.userInfo.id;
    let pic = ''
    if (req.files) {
        let files = req.files;  //获取上传文件的数据                
        console.log(files);
        let { filename, originalname } = files[0];
        pic = `${files[0].originalname}`
        //文件重命名
        fs.renameSync(path.join(`${path.dirname(__dirname)}/upload/${filename}`), path.join(`${path.dirname(__dirname)}/upload/${originalname}`));
    }

    let sql = `insert into article(title,cate_id,status,content,add_date,pic,author) 
        values('${title}','${cate_id}','${status}','${content}','${add_date}','${pic}',${author})`
    const { affectedRows } = await query(sql)
    if (affectedRows > 0) {
        res.json({
            code: 0,
            message: '添加成功'
        })
    } else {
        res.json({
            code: 1,
            message: '添加失败'
        })
    }

}

artController.delArtData = async (req, res) => {
    const { id, pic } = req.body
    const sql = `delete from article where id = ${id}`
    const { affectedRows } = await query(sql)
    if (affectedRows > 0) {
        Pic = path.join(path.dirname(__dirname), `/upload/${pic}`)
        fs.unlink(Pic, (err) => { })
        res.json({
            code: 0,
            message: '成功删除'
        })
    } else {
        res.json({
            code: 1,
            message: '删除失败'
        })
    }
}

artController.getEditData = async (req, res) => {
    const { id } = req.query;
    const sql = `select * from article where id = ${id}`
    const rows = await query(sql)
    res.send(rows[0])
}

artController.updEditData = async (req, res) => {
    //1.获取参数
    let { id, title, content, status, cate_id, isPic, oldPic } = req.body;
    console.log(isPic);
    let pic = '';
    let sql;
    //2.判断是否有上传文x   件
    if (isPic == 1) {
        let files = req.files;  //获取上传文件的数据                
        console.log(files);
        let { filename, originalname } = files[0];
        pic = `${files[0].originalname}`
        Pic = path.join(path.dirname(__dirname), `/upload/${oldPic}`)
        fs.unlink(Pic, (err) => { })
        //文件重命名
        fs.renameSync(path.join(`${path.dirname(__dirname)}/upload/${filename}`), path.join(`${path.dirname(__dirname)}/upload/${originalname}`));
        sql = `update article set title='${title}',content='${content}',cate_id='${cate_id}',status='${status}', pic='${pic}' where id = ${id} `;
    } else {
        sql = `update article set title='${title}',content='${content}',cate_id='${cate_id}',status='${status}' where id = ${id} `;
    }
    const { affectedRows } = await query(sql)
    if (affectedRows > 0) {
        res.json({ code: 0, message: '更新成功' })
    } else {
        res.json({ code: 1, message: '更新失败' })
    }
}

module.exports = artController;