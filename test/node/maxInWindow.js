function maxInWindows(num, size)
{
    const len = num.length
    if (len < size || size === 0) {
        return []
    }
    const ret = []
    const stack = []
    for(let i =0 ;i < size; i++) {
        while( stack.length && num [stack[stack.length-1]] < num [i]) {
           stack.pop()
        }
        stack.push(i)
    }
    ret.push(num[stack[0]])
    for (let i = size; i<len; i++) {
        if (stack.length && i - stack[0] === size) {
            stack.shift()
        }
        while( stack.length && (num [stack[stack.length-1]] < num [i] )) {
            stack.pop()
         }
         stack.push(i)
         ret.push(num[stack[0]])
    }

    return ret
}


console.log(maxInWindows(
    [1,2,3,4, 9],5))