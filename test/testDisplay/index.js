 ((fn,a,b,n)=>{
    for(let i=1;i<=n;i++)
    {
        setTimeout(()=>{
          fn()
        },a+i*b)
    }

 })(()=>console.log(new Date()),1000,2000,4)