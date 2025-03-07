const mongoose=require('mongoose');


const connecttodb=async()=>{
   try{await mongoose.connect('mongodb+srv://am0070563:Mishra123@users.m1v1g.mongodb.net/?retryWrites=true&w=majority&appName=Users');
   console.log("connected to mongodb")
}catch(e){console.error("connection failed",e)
process.exit(1);
}}

module.exports=connecttodb;