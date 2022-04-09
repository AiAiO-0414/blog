const path = require('path');
// const { password } = require('../config/dbconfig.js');
const controller = {};

// 导入模型
const pathDir = path.join(path.dirname(__dirname), 'views')
const query = require('../model/query.js')
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

controller.userLogin = (req, res) => {
    let { username, password } = req.body
    console.log(username);
    console.log(password);
    let userInfo = [{
        username: 'chen',
        password: '123456'
    }]
    const findUser = userInfo.find(userInfo => {
        if (userInfo.username === username && userInfo.password === password) {
            return true
        }
        return false
    })
    if (findUser) {
        req.session.loginInfo = findUser
        res.redirect('/index')
    } else {
        let responseStr = `<script>
                alert('请输入正确的账号或密码');
                location.href='/login';
            </script>`
        res.send(responseStr)
    }
}

controller.register = (req, res) => {
    res.sendFile(`${pathDir}/register.html`)
}

// controller.check = async (req, res) => {
// const sql = `select username from users `
//     let rows = await query(sql)
//     res.json(rows)
// }

controller.add = async (req, res) => {
    const { name, password } = req.body
    console.log(name);
    console.log(password);
    const sql = `select username from users`
    let rows = await query(sql)
    let {username} = rows[0]
    console.log('rows:',username);
    console.log(name==username);
    let sql1 = ''
    if (username == name) {
        console.log(11);
        // res.redirect('/register')
        // return false
        let responseStr = `<script>
        alert('该用户名已被占用');
        location.href='/register';
        </script>`
        res.send(responseStr)
    } else {
        console.log(222);
        sql1 = `insert into users(username,password) values('${name}','${password}')`
        let rows = await query(sql1)
        res.json(rows)
    }

}
module.exports = controller;