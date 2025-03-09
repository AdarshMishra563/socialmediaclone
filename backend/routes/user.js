const mongoose=require('mongoose');
const PostSchema = new mongoose.Schema({
    image: { type: String, required: true },
    caption:String, // Image URL (instead of text)
    likes: { type: Number, default: 0 }, 
    comments: [{ type: String }],
    likedby:[],
    createdAt: String // Array of comments
  })
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
image:{
    type:String,
    required:true
},
posts: { type: [PostSchema], default: [] }

});
    module.exports = mongoose.model('iosUser',ProductSch);
