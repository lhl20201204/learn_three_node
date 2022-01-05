var longestValidParentheses = function(s) {
  let len = s.length
  if(!len)
  {
      return 0
  }
  let dp = new Array(len).fill(0).map(v=>[0,0]) 
  let dp2 = new Array(len).fill(0).map(v=>[0,0])
  if(s[0]==='(')
  {
      dp[0][1] = 1
  }
  if(s[len-1]===')')
  {
      dp2[len-1][1] = 1
  }
   let max = 0
  for(let i=1;i<len;i++)
  { 
     if(s[i]==='(')
     {
        dp[i][0]=dp[i-1][0]
        dp[i][1] = dp[i-1][1]+1
     }else{
        if(dp[i-1][1]>0)
        {
            dp[i][0]=dp[i-1][0]+2
            dp[i][1] =dp[i-1][1] -1
            if(dp[i][1]===0)
            {
                max= Math.max(dp[i][0],max)
            }
        }
     }


     let bcur = len-1-i
      let bprev = bcur+1
     if(s[bcur]===')')
     {
        dp2[bcur][0]=dp2[bprev][0]
        dp2[bcur][1] = dp2[bprev][1]+1
     }else{
        if(dp2[bprev][1]>0)
        {
            dp2[bcur][0]=dp2[bprev][0]+2
            dp2[bcur][1] =dp2[bprev][1] -1
            if(dp2[bcur][1]===0)
            {
                max= Math.max(dp2[bcur][0],max)
            }
        }
     }
  }

   return max
};

console.log(longestValidParentheses("()))()()(()"))

