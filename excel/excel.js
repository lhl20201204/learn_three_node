const fs  = require("fs");
const {resolve} = require("path");
const path = require("path");
const _ = require('lodash');
const {Parser}=require('csv-parse')
const xlsx=require("xlsx");
const numeral = require("numeral")
function csv (data, options={}){
    if(typeof data === 'string'){
      data = Buffer.from(data)
    }
    const records = options && options.objname ? {} : []
    const parser = new Parser(options)
    parser.push = function(record){
      if(record === null){
        return
      }
      if(options.objname === undefined)
        records.push(record)
      else{
        records[record[0]] = record[1]
      }
    }
    const err1 = parser.__parse(data, false)
    if(err1 !== undefined) throw err1
    const err2 = parser.__parse(undefined, true)
    if(err2 !== undefined) throw err2
    return records
  }

function convertCsvToXlsx(source,destination){
    if(typeof source!=="string"||typeof destination!=="string"){
        throw new Error(`"source" and "destination" arguments must be of type string.`)
    }
    if(!fs.existsSync(source)){
        throw new Error(`source "${source}" doesn't exist.`)
    }
    const csvFile=fs.readFileSync(source,"UTF-8");
    const csvOptions={columns:true,delimiter:"$|$",ltrim:true,rtrim:true};
    const records=csv(csvFile,csvOptions);
    const wb=xlsx.utils.book_new();
    const ws=xlsx.utils.json_to_sheet(records);
    xlsx.utils.book_append_sheet(wb,ws);
   xlsx.writeFile(wb,destination);
}

function writeExcelFile(columns, data, filename, params){
    const pathName =filename
    const dataArray =data
    if(_.isNil(columns))
    {
        throw new Error('columns必传');
    }
    
    if(_.isNil(pathName))
    {
        throw new Error('pathName必传');
    }
    
    if(_.isNil(dataArray))
    {
        throw new Error('data必传');
    }

    const genExcelCellName = index => {
        const enLetter26 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      
        if (index < 26) return enLetter26[index];
      
        return `${genExcelCellName(Math.floor(index / 26) - 1)}${genExcelCellName(index % 26)}`;
    };

    const formatValueType = (v, type) => {
        if (type === 'string') return `${v}`;
        if (type === 'number') return _.isNil(v) ? v : v * 1;
        return _.isNil(v) ? '' : v;
    };
    const headers = _.map(columns, o => o.title);
    const stylesObj = {};
    const sheetData = _.map(dataArray, (o, i) => {
        return _.map(columns, (c, k) => {
          const value = _.get(o, `[${c.dataIndex}]`);

          if (_.get(c, 'styles')) stylesObj[`${genExcelCellName(k)}${i + 2}`] = _.get(c, 'styles') || {};
          if (_.has(c, 'render')) return formatValueType(c.render(value, o, i), c.type);
          return formatValueType(value, c.type);
        });
    });
    const format = params.format || function(v){return v}
    const sheetName = params.sheetName || "sheet"
    const size = params.size || 20 //每次写入规模
    const delay =params.delay || 1000 // 失败时重传等待毫秒数
    const maxErrorNum =params.maxErrorNum||5 //失败重传最大次数
    const originLength = dataArray.length||0 //原始总数据长度
    const ext = [".xlsx",".xls"]  //支持扩展的类型
    const pathUrl = resolve(__dirname,pathName) //目标文件保存绝对路径
    const pathCsvUrl = resolve(__dirname,pathName.slice(0,pathName.lastIndexOf('.'))+".csv") //目标衍生csv文件保存绝对路径
    const action = {
        writeFile:"写入",
        appendFile:"追加"
     } 
   const delimiter="$|$"
   const LF ="\n" 
   let errNum=0
   let count = 1


   return new Promise((res1,rej1)=>{

       if(ext.indexOf(path.extname(pathName).toLowerCase())===-1){
                return rej1({
                    code:-1,
                     tip:"保存的文件格式仅支持"+ext.toString()
                  })
             }

      

       if(originLength===0){
                return rej1({
                      code:-2,
                      tip:"插入的"+dataArray+"长度必须大于0"
           })

        }
        
      let fn =(data)=>{ 

        new Promise((res,rej)=>{

        data =data||sheetData.splice(0,size)
            if(!Array.isArray(data)){
              return rej({
                    code:-3,
                    tip:"插入的"+data+"必须是个数组"
                })
            }
            if(data.length===0)
            {
                return res({code:3,
                  tip:"全部插入成功,插入的数据看content",
                  content:dataArray
                 }    
                )
            }
            if(!data.every(v=>v instanceof Object))
            {
              return rej({code:-4,
                  tip:"第"+(count)+"次传输"+data+"不是对象数组",
                   data
                 }    
                )
            }

        let type = !fs.existsSync(pathName)?"writeFile":"appendFile"
        let buffer = data.map(v=>v.map(format).join(delimiter)+LF).join('')

         if(type === "writeFile")
         {
                buffer=headers.join(delimiter)+LF+buffer
                      
                fs.writeFile(pathCsvUrl,buffer,(err)=>{
                    if(!err){

                        try {
                               convertCsvToXlsx(pathCsvUrl, pathUrl);
                            return  res({
                            code:1,
                            tip:action[type]+"内容到"+pathUrl+"成功，写入"+data.length+"行数据",
                            content:buffer
                           })
                        } catch (e) {
                            rej(
                                {
                                    code:-5,
                                    tip:action[type]+"内容到"+pathUrl+"失败,错误原因："+err,
                                    data
                                }
        
                            )
                        }    
                    }
                    rej(
                        {
                            code:-6,
                            tip:action[type]+"内容到"+pathCsvUrl+"失败,错误原因："+err,
                            data
                        }

                    )
                })
       }//将文件内容写入文件中
       else{
        try{
             if(!fs.existsSync(pathCsvUrl))
             {
               return  rej(
                    {
                        code:-7,
                        tip:"追加文件到"+pathUrl+"必须依赖于"+pathCsvUrl,
                        data
                    }

                )
             }
 
             fs.appendFile(pathCsvUrl,buffer,(err)=>{
                       if(err)
                       {
                           throw new Error(err)
                       }
                       convertCsvToXlsx(pathCsvUrl, pathUrl);
                        return  res({
                        code:2,
                        tip:action[type]+"内容到"+pathUrl+"成功，写入"+data.length+"行数据",
                        content:buffer
                       })
                   })
        }//try
        catch(err)
        {
            rej(
                {
                    code:-4,
                    tip:action[type]+"内容到"+pathUrl+"失败,错误原因："+err,
                    data
                }

            )
        }
    
       }//将文件内容插入文件中
             
          
    })//promise
    .then(res=>{
        let {code} = res
            if(code===1||code===2)
            {
                console.log("第"+(count++)+"次传输",res.tip)
            fn()
            }else if(code===3){ // 待扩展，防止以后有code>3
                res1(pathUrl)
            }
     })//then
     .catch(err=>{
        errNum++
       if(errNum>maxErrorNum)
        {
           return rej1("达到最大错误次数,传输中断")
        } 
        console.log("第"+errNum+"次错误","错误原因:"+(err.tip||err),delay+"豪秒后重传") 
        setTimeout(()=>{
            if(Array.isArray(err.data))
            {
                fn(err.data)
            }else{
                rej1(err)
            }
        },delay)
      })//catch
    
      } //fn
      fn()
   })
}

let dataArray =[]
const names = ["张三","李四","王五","张伟","李静","张鸣"]
for(var i=0;i<60;i++)
{
    let t =Math.floor(Math.random()*6) 
    dataArray.push({fundCode:names[t],age:10+parseInt(Math.random()*30) ,daysOfRedemption:1+parseInt(Math.random()*5)})
}

const columns = [
    {
      title: '证券代码',
      dataIndex: 'fundCode',
      render: (v,o,i)=>{
          return o['age']+v
      }
    },
    {
      title: '销售人代码2',
      render: () => '103000000003',
    },
    {
      title: '赎回交收天数（天）',
      dataIndex: 'daysOfRedemption',
      type: 'number',
      styles: {
        z: '0',
      },
    },
  ];

let pathName  = "./工作簿8.xlsx"
// writeExcelFile(columns, dataArray,pathName, {
   
// }).then(res=>{
//    console.log(res)
// })

// console.log(numeral)
console.log(Number(numeral(Number(1.000)).format('0.00')))

