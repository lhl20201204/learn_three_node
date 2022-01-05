var findMedianSortedArrays = function(nums1, nums2) {
       let len1 = nums1.length
       let len2 = nums2.length
       let right  = Math.floor((len1+len2) /2)
       nums1.splice(0,0,...nums2).sort((a,b)=>a-b)
     return (len1+len2)%2?nums1[right]:(nums1[right-1]+nums1[right])/2
}; 


console.log(findMedianSortedArrays(nums1 = [3], nums2 = [-2,-1]))