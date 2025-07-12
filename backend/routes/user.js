const mongoose = require("mongoose");


const CommentSchema = new mongoose.Schema({
  username: { type: String, required: true }, 
  text: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now } 
});


const PostSchema = new mongoose.Schema({
    type:{type:String,required:true},
  url: { type: String, required: true },
  thumb:{type:String},
  caption: String, 
  likes: { type: Number, default: 0 }, 
  comments: { type: [CommentSchema], default: [] }, 
  likedby: { type: [String], default: [] }, 
  createdAt: { type: Date, default: Date.now } 
});


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  number: {
    type: String,
    unique: true,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  posts: { type: [PostSchema], default: [] } 
});


module.exports = mongoose.model("testingvideo", UserSchema);
