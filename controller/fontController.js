// 导入模型
const query = require('../model/query.js')
const fontController = {};


// 分类接口
fontController.cate = async (req, res) => {
    const sql = `select * from category order by orderBy desc`
    const rows = await query(sql)
    res.json(rows)
}

fontController.artData = async (req, res) => {
    const { page, limit } = req.query;
    const offset = (page - 1) * limit
    const sql = `SELECT
        t1.*, t2.cate_name,t3.username
        FROM
            article t1
        LEFT JOIN category t2 ON t1.cate_id = t2.cate_id
        left join users t3 on t1.author = t3.id
        where t1.status = 1
        order by t1.id desc
        limit ${offset},${limit}`
    let rows = await query(sql)
    rows = rows.map(item => {
        item.host = 'http://127.0.0.1:3000/'
        return item;
    })
    res.json(rows)
}

fontController.CatesData = async (req, res) => {
    const {
        cate_id
    } = req.query;
    const sql = `select t1.*,t2.cate_name from article t1 left join category t2 on t1.cate_id = t2.cate_id where t1.cate_id = ${cate_id}`
    let result = await query(sql);
    result = result.map(item => {
        item.host = 'http://127.0.0.1:3000/'
        return item;
    })
    res.json(result)
}

fontController.OneArt = async (req, res) => {
    const {
        id
    } = req.query;
    const sql = `select t1.*,t2.cate_name from article t1 left join category t2 on t1.cate_id = t2.cate_id where t1.id = ${id}`
    const result = await query(sql);
    res.json(result[0] || {})
}

module.exports = fontController;