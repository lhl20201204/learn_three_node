// apiRouter.js

const express = require('express')
const router = express.Router();
const fs = require("fs");
const {resolve} =require("path")
const getClass =require("./template")

router.get('/getInfo', (req, res)=>{
    setTimeout(()=>{
      console.log('我进来了', new Date())
    res.header("Access-Control-Allow-Origin", "*");
    res.send('hello world')
    },3000)
})

// 这里挂载对应的路由
router.get('/get', (req, res) => {
    // 通过 req.query 获取客户端通过查询字符串，发送到服务器的数据 
    res.header("Access-Control-Allow-Origin", "*");
    let {name} = req.query;

    let path = "../react-three/src/pages/"+name
    console.log(path)
     if(fs.existsSync(path)){
        return res.send({
            status: 200, 
            msg: '目录已经存在！', 
            data: '目录已经存在！！', 
        });
     }


       
   function getP4()
   {
       return new Promise((res4,rej4)=>{
            fs.readFile("../react-three/src/router/route.js",function(err,data){
        if(err)
        {
            rej4(err)
            return 
        }
        console.log(data.toString('utf-8'))
         res4(data.toString('utf-8'))
         }) 
       })
     
   }


    
    // 调用 res.send() 方法，向客户端响应处理的结果
    let text= name
    let data = getClass(text)
    let data2=`
    #${text}Container{
        width: 700px;
        height: 700px;
        position: relative;
    }
    
    #${text}Container H1{
        display: inline-block;
        position: absolute;
        color: white;
        left: 50%;
        top:50%;
        transform: translate(-50%,-50%);
    }
    
    `     
     function getP1()
     {
         return new Promise((res1,rej1)=>{
              fs.mkdir(path,(err,data)=>{
                 res1()
               })
         })
     }

    function getP2(){
        return new Promise((res2,rej2)=>{
            console.log("文件名",path+'/'+name+".js")
         
        fs.writeFile(path+'/'+name+".js",data,(err)=>{
              rej2()
        })

            res2()
        })
    } 


    function getP3(){
        return new Promise((res3,rej3)=>{
            console.log("文件名",path+'/'+name+".css")
         
        fs.writeFile(path+'/'+name+".css",data2,(err)=>{
              rej3()
        })

            res3()
        })
    }


  
    Promise.resolve(getP1()).then(getP2()).then(getP3()).then(getP4).then(x=>{       
             let arr = x.split(";")
             
             let len =arr.length
             arr.splice(len-2,0,`\nimport ${name} from '../pages/${name}/${name}'`)
             let ttt = arr[len-1]
             arr.splice(len-1,1)         
             let i = ttt.indexOf('\]')
             let ntt = ttt.slice(0,i)+`    {to:"/${name}",content:"${name}",componment:${name}},\n`+ttt.slice(i)
             arr.push(ntt) 
             let code =arr.filter(v=>!!v).join(';')+";"
            console.log(code)
          fs.writeFile("../react-three/src/router/route.js",code,()=>{
               res.send({
                 status:200,
                 msg:"写入成功"
             })
          })
    }).catch(err=>res.send({
        status:404,
        msg:err
    }))


   
});

// 定义 post 接口
router.post('/post', (req, res) => {
    // 通过 req.body() 获取请求体中的 url-encoded 格式的数据
    const body = req.body;
    // 调用 res.send() 方法，向客户端响应结果
    res.send({
        status: 0,
        msg: 'POST 请求成功！',
        data: body,
    });
});

module.exports = router;
