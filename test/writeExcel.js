const fs  = require("fs")
const {resolve} = require("path")
const path = require("path")
const  xlsx = require('node-xlsx');
const XLSX = require('xlsx');
const excelrange = function (len){
	if(isNaN(len)){
		throw Error('input should be number');
	}
	if(Number(len) > 18277){
		throw Error('maximum length supported is 18277');
	}
	var map = [
		"","A","B","C","D","E","F","G","H","I","J",
		"K","L","M","N","O","P","Q","R","S","T","U",
		"V","W","X","Y","Z"
	];
	var val = [0, 0, 0];	
	while(len){
		if(len > 26){
			len = len - 26; 
			if(val[1] < 26){
				val[1] = (val[1] + 1);
			}else{
				val[0] = (val[0] + 1); 
				val[1] = 1;
			}
		}else{
			var remain = (26 - val[2]);
			if(len >= remain){
				len = (len - remain);
				if(val[1] >= 26){
					val[0] = val[0] + 1;
					val[1] = 1;
					val[2] = (1 + len);
				}else{
					if(len > 0){
						val[1] = val[1] + 1;
						val[2] = (1 + len);	
					}else{
						val[2] = val[2] + remain;
					}	
					
				}
				len = 0;
			}else{
				val[2] = (val[2] + len);
				if(val[2] > 26){					
					if(val[1] >= 26){
						val[1] = 1;
						val[0] = (val[0] + 1);
					}else{
						val[1] = (val[1] + 1);
					}
					val[2] = 1;
				}
				len = 0;
			}			
		}	
	}
	return [
		map[val[0]],
		map[val[1]],
		map[val[2]]
	].join('');
}
const addRow = function(row,filepath,sheet_name,cb){
      var mapAlpha = {
        A:1,
        B:2,
        C:3,
        D:4,
        E:5,
        F:6,
        G:7,
        H:8,
        I:9,
        J:10,
        K:11,
        L:12,
        M:13,
        N:14,
        O:15,
        P:16,
        Q:17,
        R:18,
        S:19,
        T:20,
        U:21,
        V:22,
        W:23,
        X:24,
        Y:25,
        Z:26
      };
    
      var data = row
    
      var wb = XLSX.readFile(filepath);
      // xlsx 21879行
      var worksheet = wb.Sheets[sheet_name]
      var ref = worksheet['!ref']
      var rowNumber = 1
      var keyPrefix = null
      var refDefined = ref ? true : false
    
      if(refDefined){
        var lastRow = ref.match(/(\d+$)/)
    
        if(lastRow){
          rowNumber = Number(lastRow[0]) + 1
        }
          ref = ref.split(':')
        keyPrefix = ref[1].match(/^([a-zA-Z])+/)
        if(keyPrefix){
          keyPrefix = keyPrefix[0];
        }
      }else{
        ref = ['A1', 'A1']
      }
    
      data.forEach((row)=>{
        //app.logger.info(row)
        row.forEach((cell, index)=>{
          var key = excelrange(index+1);
          worksheet[key + rowNumber] = {
            "t": isNaN(cell) ? "s" : "n",
            "v": cell,
            "h": cell,
            "w": cell
          }
          //app.logger.info((key + rowNumber)  +  cell)
          ref[1] = (
            refDefined ?
            bigger(key, keyPrefix, (index+1)) :
            (keyPrefix ?
              keyPrefix
              : key )
            )+ rowNumber
        })
        ++rowNumber
      });
    
      worksheet['!ref'] = ref.join(':')
      //app.logger.info(worksheet)
      //console.log(wb)
      XLSX.writeFile(wb, filepath);
      return cb(null, {
        result: 'New Row Added'
      })
    
    function bigger(a, b, aVal, bVal){
    if(!aVal){
      aVal = a.split('').reduce((initial, i, j, k)=>{
        return (initial + mapAlpha[i] + ((j < (k.length-1)) ? (26 - mapAlpha[i]): 0))
      }, 0)
    }
    if(!bVal){
      bVal = b.split('').reduce((initial, i, j, k)=>{
        return (initial + mapAlpha[i] + ((j < (k.length-1)) ? (26 - mapAlpha[i]): 0))
      }, 0)
    }
    if(aVal > bVal){
      return a
    }
    return b
    }
    
    }

function writeExcelFile(params){

   function addDataToBuffer(buffer,data){
    for(var i in data)
    {
        const row = data[i]
        const tt = []
       for(var j in row)
       {
         tt.push(row[j])
       }
       buffer.push(tt)
    }
   } 

   const pathName =params.pathName
   const dataArray = params.dataArray
   const sheetName=params.sheetName||"sheet"
   const size =params.size||20
   const delay =params.delay ||1000
   const maxErrorNum =params.maxErrorNum||5
   const originLength = dataArray.length||0
   const ext = [".xlsx",".xls"]  
   const pathUrl = resolve(__dirname,pathName)
   const action = {
        writeFile:"写入",
        appendFile:"追加"
     } 
  let errNum=0
  let count = 1

   return new Promise((res1,rej1)=>{

       if(ext.indexOf(path.extname(pathName).toLowerCase())===-1){
                return rej1({
                    code:-1,
                     tip:"保存的文件格式仅支持"+ext.toString()
                  })
             }

       if(!Array.isArray(dataArray)){
              return rej1({
                    code:-2,
                    tip:"插入的"+dataArray+"必须是个数组"
                })
            }

       if(originLength===0){
                return rej1({
                      code:-3,
                      tip:"插入的"+dataArray+"长度必须大于0"
           })

        }
        
      let fn =(data)=>{ 

        new Promise((res,rej)=>{

        data =data||dataArray.splice(0,size)

                  if(data.length===0)
                  {
                      return res({code:2,
                        tip:"全部插入成功,插入的数据看content",
                        content:dataArray
                       }    
                      )
                  }
             
                  if(!data.every(v=>v instanceof Object))
                  {
                    return rej({code:-5,
                        tip:"第"+(count)+"次传输"+data+"不是对象数组",
                         data
                       }    
                      )
                  }

        let type = !fs.existsSync(pathName)?"writeFile":"appendFile"
         let buffer =  []
         addDataToBuffer(buffer,data)
         if(type === "writeFile")
         {
                let head =[]
                for(var i in data[0])
                {
                    head.push(i)
                }
                buffer.unshift(head) 
                var buffers =xlsx.build([
                    {
                        name:sheetName,
                        data:buffer
                    }        
                ])
                fs.writeFile(pathUrl,buffers, 'binary',(err)=>{
                    if(!err){
                        return  res({
                            code:1,
                            tip:action[type]+"内容到"+pathUrl+"成功，写入"+data.length+"行数据",
                            content:buffer
                        })
                    }
                    rej(
                        {
                            code:-4,
                            tip:action[type]+"内容到"+pathUrl+"失败,错误原因："+err,
                            data
                        }

                    )
                })
       }//将文件内容写入文件中
       else{
        try{
          addRow(buffer ,pathUrl,sheetName,function(err,result){
              if(err)
              {
                  throw new Error(err)
              }
            res({
                code:1,
                tip:action[type]+"内容到"+pathUrl+"成功，插入"+buffer.length+"行数据",
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
            if(code===1)
            {
                console.log("第"+(count++)+"次传输",res.tip)
            fn()
            }else{
                res1(res)
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
           fn(err.data)
        },delay)
      })//catch
    
      } //fn
      fn()
   })
}

let dataArray =[]
const names = ["张三","李四","王五","张伟","李静","张鸣"]
for(var i=0;i<1;i++)
{
    let t =Math.floor(Math.random()*6) 
    dataArray.push({name:names[t],age:10+parseInt(Math.random()*30) ,sex:Math.random()<1/2?"男":"女"})
}

let pathName  = "./工作簿2.xlsx"
writeExcelFile({
    pathName,
    dataArray
}).then(res=>{
   console.log(res.tip)


  //  const { createReadStream } = require("fs");
  //  const readline = require("readline");
  //  (async () => {
  //    // 创建一个流
  //    const stream = createReadStream(pathName, "utf-8");
   
  //    const rl = readline.createInterface({
  //     input: stream,
  //     crlfDelay: Infinity,
  //   });
  //    let ref = null
  //   for await (const line of rl) {
  //     // 文件中的每一行都会依次被 line 变更接收
  //     let match = line.match(/\<dimension ref=\"(.*?)\"\/\>/)
  //      if(match){
  //        ref = match[1]
  //        console.log(line)
  //         break
  //      }
  //   }
  //    console.log(ref)

//   //    fs.open(pathName,'r','0666',function(err,fd){
//   //     if(err){
//   //        console.log("打开失败");
//   //     }else{
//   //        var buf=new Buffer(128);
//   //        console.log(buf)
//   //        fs.read(fd,buf,1,30,0,function(err,bytesRead,buf){
//   //            if(err){
//   //                console.log("指定位置读取文件失败");
//   //            }else{
//   //                console.log(bytesRead);
//   //                console.log(buf);
//   //            }
//   //        })
//   //     }
//   // })


   // })();

 }).catch(err=>console.log(err))



function getTemplate(str){
   let instId = +str.match(/(?<=r\=\"\w*)([0-9]+?)(?=\")/g)[0]
   return function(array)
   {
     if(!Array.isArray(array))
     {
       let t = []
        for(let i in array)
        {
          t.push(array[i])
        }
        array =t
     }//处理对象

     let s = str.replace(/(?<=r\=\"\w*)([0-9]+?)(?=\")/g,node=>instId+1)
     instId++
     let ai = 0
      s = s.replace(/(?<=\<v\>)(.*?)(?=\<\/v\>)/g,node=>{
        return array[ai++]
      })
      return s
   }
}

function getInsertDom(template,arr){
let fn= getTemplate(template)
return arr.map(v=>fn(v)).join('')

}

function toUint8Arr(str) {
  const buffer = [];
  for (let i of str) {
      const _code = i.charCodeAt(0);
      if (_code < 0x80) {
          buffer.push(_code);
      } else if (_code < 0x800) {
          buffer.push(0xc0 + (_code >> 6));
          buffer.push(0x80 + (_code & 0x3f));
      } else if (_code < 0x10000) {
          buffer.push(0xe0 + (_code >> 12));
          buffer.push(0x80 + (_code >> 6 & 0x3f));
          buffer.push(0x80 + (_code & 0x3f));
      }
  }
  return Uint8Array.from(buffer);
}


// pathName = "./工作簿2.xlsx"
// fs.readFile(pathName,(err,data)=>{
//   let code = 'base64'
//   let cells  = Buffer.from(data).toString(code);
//   console.log(cells.toString('utf-8'))
//   // let matcher= cells.match(/\<row(.*?)\>(.*?)\<\/row\>/g)
//   // let template = matcher[matcher.length-1]
//   // let dataArray = [['张三',15,'男'],['老七',20,'女']]
//   // let templateDom = getInsertDom(template,dataArray)
//   // cells= cells.replace(/(?<=ref=\")(.*?)(?=\")/g,(node)=>{
//   //  let ref = node.split(':')
//   //   keyPrefix = ref[1].match(/^([a-zA-Z])+/)
//   //  return ref[0]+":"+keyPrefix[0]+(+ref[1].match(/\d+$/)[0]+dataArray.length )
//   // })
//   // let insertId = cells.indexOf('</sheetData>')
//   //  console.log(cells.slice(0,insertId)+templateDom+cells.slice(insertId)) 
// // 
//  let newData = Buffer.from(cells,code)
//   console.log(newData)
//    fs.writeFile('news2.xlsx',newData,()=>{
      
//    })
//  })






function generate(options) {
  options = extend(options || {}, {
      base64: true,
      compression: "STORE",
      type: "base64",
      comment: null
  });

  utils.checkSupport(options.type);

  var zipData = [],
      localDirLength = 0,
      centralDirLength = 0,
      writer, i,
      utfEncodedComment = utils.transformTo("string", this.utf8encode(options.comment || this.comment || ""));

  // first, generate all the zip parts.
  for (var name in this.files) {
      if (!this.files.hasOwnProperty(name)) {
          continue;
      }
      var file = this.files[name];

      var compressionName = file.options.compression || options.compression.toUpperCase();
      var compression = compressions[compressionName];
      if (!compression) {
          throw new Error(compressionName + " is not a valid compression method !");
      }

      var compressedObject = generateCompressedObjectFrom.call(this, file, compression);

      var zipPart = generateZipParts.call(this, name, file, compressedObject, localDirLength);
      localDirLength += zipPart.fileRecord.length + compressedObject.compressedSize;
      centralDirLength += zipPart.dirRecord.length;
      zipData.push(zipPart);
  }

  var dirEnd = "";

  // end of central dir signature
  dirEnd = signature.CENTRAL_DIRECTORY_END +
  // number of this disk
  "\x00\x00" +
  // number of the disk with the start of the central directory
  "\x00\x00" +
  // total number of entries in the central directory on this disk
  decToHex(zipData.length, 2) +
  // total number of entries in the central directory
  decToHex(zipData.length, 2) +
  // size of the central directory   4 bytes
  decToHex(centralDirLength, 4) +
  // offset of start of central directory with respect to the starting disk number
  decToHex(localDirLength, 4) +
  // .ZIP file comment length
  decToHex(utfEncodedComment.length, 2) +
  // .ZIP file comment
  utfEncodedComment;


  // we have all the parts (and the total length)
  // time to create a writer !
  var typeName = options.type.toLowerCase();
  if(typeName==="uint8array"||typeName==="arraybuffer"||typeName==="blob"||typeName==="nodebuffer") {
      writer = new Uint8ArrayWriter(localDirLength + centralDirLength + dirEnd.length);
  }else{
      writer = new StringWriter(localDirLength + centralDirLength + dirEnd.length);
  }

  for (i = 0; i < zipData.length; i++) {
      writer.append(zipData[i].fileRecord);
      writer.append(zipData[i].compressedObject.compressedContent);
  }
  for (i = 0; i < zipData.length; i++) {
      writer.append(zipData[i].dirRecord);
  }

  writer.append(dirEnd);

  var zip = writer.finalize();



  switch(options.type.toLowerCase()) {
      // case "zip is an Uint8Array"
      case "uint8array" :
      case "arraybuffer" :
      case "nodebuffer" :
         return utils.transformTo(options.type.toLowerCase(), zip);
      case "blob" :
         return utils.arrayBuffer2Blob(utils.transformTo("arraybuffer", zip));
      // case "zip is a string"
      case "base64" :
         return (options.base64) ? base64.encode(zip) : zip;
      default : // case "string" :
         return zip;
   }

}

