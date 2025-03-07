const fs=require('fs')
const path=require('path')
const dirPath= path.join(__dirname,'myapp')
console.log(dirPath)
for(i=0;i<5;i++){
    fs.writeFileSync(dirPath+`/New${i}.txt`,`file${i}`)
}
fs.readdir(dirPath,(err,files)=>{files.forEach((i)=>console.log(i))})
const filepth=`${dirPath}/another.js`
fs.writeFileSync(filepth,'console.log("shh"); console.log("sggsggs")')
fs.readFile(filepth,'utf8',(err,file)=>{console.log(file)});
fs.appendFile(filepth,'newwwwww',(err)=>{if(!err){console.log("updated")}})
    fs.rename(filepth,`${dirPath}/another_new.js`,(err)=>{if(!err){console.log("updated")}})