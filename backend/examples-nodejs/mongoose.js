const mongoose=require('mongoose');
const express=require('express');
const app=express();
app.use(express.json());

const main=async()=>{
    await mongoose.connect('mongodb://localhost:27017/comm');
    const ProductSch=new mongoose.Schema({name:String,price:Number});



const ProductModel= mongoose.model('aks',ProductSch);
// let data=new ProductModel({name:"ku8888yutfc",price:77,term:"hyhhhh"});
// let result=await data.save();
let result =await ProductModel.find() ;
app.get('/',(req,resp)=>{
    resp.send(result) ;
 })
app.listen(8800)
console.log(result) ;   
   };

   //search 
   app.get('/:key',async (req,resp)=>{

    ;
    let result =await ProductModel.find(
        {
            "$or":[{"name":{$regex:req.params.key}}]
        }
    );
    resp.send(result);
    console.log(del)
})
main();
