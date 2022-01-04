let s = {x:1}
let s2 =s
  s2.a ='a'
console.log(s2, s, !Number(s2) )
if(!Number(s2))
{
    alert()
}
let t =[]
let g = t
g.push(1)
console.log(Number(t.toString()),t===g)