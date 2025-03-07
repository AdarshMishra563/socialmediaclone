const express=require('express');
const dbConnection=require('./mongodb');
const app=express();
app.use(express.json());
// app.get('/',async (req,resp)=>{

//     let data=await dbConnection();
//     data=await data.find().toArray();
//     resp.send(data)
// })
app.delete('/:name',async (req,resp)=>{
const data =await dbConnection();
const result = await data.deleteOne({name:req.params.name})
resp.send(result) ;
   
})
app.put('/',async (req,resp)=>{
    const data =await dbConnection();
    const result = await data.insertOne(req.body)
    resp.send(result) ;
       
    })
    app.listen(3400)
app.listen(3400)