const path = require('path');
const md5 = require('md5');
const controller = {};
const fs = require('fs')

// 导入模型
const pathDir = path.join(path.dirname(__dirname), 'views')
const query = require('../model/query.js')
const { password_secret } = require('../config/mdconfig.js')
controller.index = (req, res) => {
    // res.sendFile(`${pathDir}/index.html`)
    res.render('index.html');
    // const sql = `select * from article`
    // let rows = await query(sql)
    // res.json(rows)
}

controller.login = (req, res) => {
    res.sendFile(`${pathDir}/login.html`)
}

controller.changePass = (req, res) => {
    res.sendFile(`${pathDir}/changePass.html`)
}

controller.userLogin = async (req, res) => {
    let { username, password } = req.body
    password = md5(`${password}${password_secret}`)
    const sql = `select * from users where username='${username}' and password='${password}'`
    let rows = await query(sql)
    if (rows.length === 1) {
        //讲信息记录到session
        req.session.userInfo = rows[0]
        res.cookie('userInfo', JSON.stringify(rows[0]), {
            expires: new Date(Date.now() + 1 * 3600000),
        })
        let responseStr = { code: 0, message: '登录成功' }
        res.send(responseStr)
    } else {
        let responseStr = { code: 1, message: '请输入正确账号或密码' }
        res.send(responseStr)
    }

}

controller.register = (req, res) => {
    res.sendFile(`${pathDir}/register.html`)
}

controller.add = async (req, res) => {
    let { name, password } = req.body
    password = md5(`${password}${password_secret}`)
    const sql = `select * from users where username = '${name}'`
    let rows = await query(sql)
    if (rows.length === 1) {
        req.session.userInfo = rows[0]
        let responseStr = { code: 1, message: '该用户名被占用' }
        res.send(responseStr)
    } else {
        sql1 = `insert into users(username,password) values('${name}','${password}')`
        let rows = await query(sql1)
        let responseStr = { code: 0, message: '注册成功' }
        res.send(responseStr)
    }
}

controller.logoData = async (req, res) => {
    const sql = `select * from logo`
    let rows = await query(sql)
    res.json(rows)
}

controller.updUserInfo = async (req, res) => {
    const {
        id,
        intro
    } = req.body;
    const sql = `update users set intro = '${intro}' where id = ${id}`;
    const { affectedRows } = await query(sql)
    const successData = {
        code: 0,
        message: "更新成功"
    }
    const failData = {
        code: 1,
        message: "更新失败"
    }
    if (affectedRows > 0) {
        //成功的话取出用户信息
        const sql = `select * from users where id = ${id}`
        const rows = await query(sql)
        // 将信息记录到session或cookie
        req.session.userInfo = rows[0];
        res.cookie('userInfo', JSON.stringify(rows[0]), {
            expires: new Date(Date.now() + 1 * 3600000),
        })
        res.json(successData)
    } else {
        res.json(failData)
    }
}

//退出登录功能
controller.logout = async (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            throw err;
        }
    })
    res.json({
        code: 0,
        message: "logout success"
    })
}

//修改密码功能
controller.change = async (req, res) => {
    let { id, password, old, news, news2 } = req.body
    console.log(id);
    // password = md5(`${password}${password_secret}`)
    old = md5(`${old}${password_secret}`)
    news = md5(`${news}${password_secret}`)
    news2 = md5(`${news2}${password_secret}`)
    const sql = `select * from users where id = ${id}`
    let rows = await query(sql)
    console.log('news2:',news2);
    console.log('news:',news);
    console.log(news === news2);
    if (old !== password) {
        let responseStr = { code: 1, message: '请输入正确的密码' }
        res.send(responseStr)
    } else {
        if (news !== news2) {
            let responseStr = { code: 1, message: '两次密码输入不一致' }
            res.send(responseStr)
        } else {
            const sql = `update users set password = '${news}' where id = ${id}`
            const { affectedRows } = await query(sql)
            // 将信息记录到session或cookie
            req.session.userInfo = affectedRows[0];
            res.cookie('userInfo', JSON.stringify(affectedRows[0]), {
                expires: new Date(Date.now() + 1 * 3600000),
            })
            if (affectedRows > 0) {
                let responseStr = { code: 0, message: '修改成功' }
                res.json(responseStr)
            }
        }

    }
}

//头像功能
controller.upAvatar = async (req, res) => {
    const {
        id,
    } = req.session.userInfo;
    if (req.files) {
        let files = req.files;  //获取上传文件的数据
        let { filename, originalname } = files[0];
        let pic = `${files[0].originalname}`
        //文件重命名
        fs.renameSync(path.join(`${path.dirname(__dirname)}/upload/${filename}`), path.join(`${path.dirname(__dirname)}/upload/${originalname}`));
        
        //上传新图删除新图
        let oldPic = req.session.userInfo.avatar
        oldPic = path.join(path.dirname(__dirname),`/upload/${oldPic}`)
        fs.unlink(oldPic,(err)=>{})

        //执行mysql语句
        const sql = `update users set avatar = '${pic}' where id = ${id}`
        await query(sql);

        // 取出用户信息，再同步session和cookie中的用户信息
        const sql2 = `select * from users where id = ${id}`
        const result = await query(sql2)
        // 将信息记录到session或cookie
        req.session.userInfo = result[0];
        res.cookie('userInfo', JSON.stringify(result[0]), {
            expires: new Date(Date.now() + 1 * 3600000),
        })
        res.json({
            code: 0,
            message: "upload success"
        })
    } else {
        res.json({
            code: 1,
            message: "upload fail"
        })
    }
}

module.exports = controller;