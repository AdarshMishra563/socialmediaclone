const mongoose=require('mongoose');
const ProductSch=new mongoose.Schema({name:{
    type:String,
    required:true,
    
    trim:true
},email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
},
number:{
    type:Number,
    unique:true,
    required:true
},
address:{
    type:String,
    required:true
}

});
    module.exports = mongoose.model('iosUser',ProductSch);