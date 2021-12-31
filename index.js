const express = require('express')
const app = express()
const port = 80;
// 配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }));

const apiRouter = require('./apiRouter');
// 把路由模块，注册到 app 上
app.use('/api', apiRouter);


app.listen(port, () => console.log(`Example app listening on port port!`))
