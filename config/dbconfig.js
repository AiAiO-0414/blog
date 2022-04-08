require('dotenv').config()

module.exports = {
    host: process.env.host, //主机
    port: this.post, //端口
    user: process.env.user, //用户名
    password: process.env.password, //密码
    database: "students" //数据库
}