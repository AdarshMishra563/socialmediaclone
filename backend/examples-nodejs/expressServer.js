// const express=require('express');
// const path=require('path')
// const dirPath=path.join(__dirname,'myapp')

// const app = express();
// app.use(express.static(dirPath))
//  app.listen(3800);
//  app.get('',(_,resp)=>{
//     resp.sendFile(`${dirPath}/index.html`)
// })
// app.get('*',(_,resp)=>{
//     resp.sendFile(`${dirPath}/home.html`)
// })





//  const express=require('express');
//  const path=require('path')
 
//  const route=express.Router();
 
 
//  const reqFilter=(req,resp,next)=>{
//      if(!req.query.age){
//          resp.send("provide age")
 
//      }
//      else{next()}
//  }
//  route.use(reqFilter)
//  // app.use(reqFilter)
//  route.get('',(req,resp)=>{
//      const age=req.query.age
//      resp.send("welcome home"+" "+age)
//  })
//  route.get('/user',(req,resp)=>{
//      resp.send("welcome home user")
//   })
//  app.use('/',route)
//   app.listen(3400)
