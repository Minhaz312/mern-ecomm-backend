export default function has(data,key) {
  if(data[key]!=null && data[key]!=undefined && data[key]!=""){
    return true
  }else {
    return false
  }
}
