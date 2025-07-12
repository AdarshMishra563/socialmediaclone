const User =require('./user');

const jwt = require("jsonwebtoken");
const crypto = require("crypto"); 

const cloudinary = require("cloudinary").v2;

const multer = require("multer");
const { promisify } = require("util");

cloudinary.config({
  cloud_name:"de0v39ltg",
  api_key:"389592325465775",
  api_secret:"s-eZ4GsC5W2TRvPC12XvAtQSAt0",
});

const generateSignature = () => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = crypto
    .createHash("sha1")
    .update(`timestamp=${timestamp}${cloudinary.config().api_secret}`)
    .digest("hex");

  return { timestamp, signature };
};

const uploadToCloudinary = promisify(cloudinary.uploader.upload);
const registerUser = async (req, res) => {
    try {
      console.log("Incoming Request Body:", req.body);
      
      const { name, email, password, number, image } = req.body;
  
      if (!name || !email || !password || !number || !image) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
  
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }
  
      
      const hashedPassword = password;
  
      
      
    
  

  

      
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        number,
        image 
      });
  
      console.log(" User Created:", newUser);
  
      res.status(201).json({
        success: true,
        message: "Registered successfully",
      });
    } catch (error) {
      console.error(" Registration Error:", error);
      res.status(500).json({
        success: false,
        message: "Some error occurred",
      });
    }
  };
const loginUser=async (req ,res)=>{
    try{
        const {email,password}=req.body ;
        const user= await User.findOne({email,password});
        if(!user){
            return res.status(400).json({status:"false",
                message:"user doesn,t exist or invalid credintials"
            })
        }
        console.log(user);
        const isMatch=password;
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    
        const token = jwt.sign({ id: user._id }, "b81e9ab305130c87118bc792fdbbf1a73b732c659ff2b7742f7bd41aca1315a2", { expiresIn: "1h" });
        res.json({ token, user: user });

    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:'Some error'
        })
    }
}
const password=async (req, res) => {
    try {
        const { email} = req.params;
         
        const {  password } = req.body; // Get new data from request body
       
        // Find the user and update their data
        const updatedUser = await User.findOneAndUpdate(
            {email},
            {  password:hashedPasswordnew },
            { new: true, runValidators: true }
        );
console.log(updatedUser);
        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User updated successfully", user: updatedUser ,status:true});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
const get=async (req,res)=>{
    try {
        const { email} = req.params;
        
    const find=await User.findOne({email});
    console.log(await find)
  if(find!==null){
    res.json({message:"user find ",user:find,status:true})
  }else{res.json({status:false,
    message:"User doesn,t exist"
  })}
    }
        catch(err){
            res.status(500).json({message:" server err ",err})
        }

};
const usercount=async (req, res) => {
    try {
        const { _id} = req.body;
        const find=await User.find({_id})
         
        const updated = await User.findOneAndUpdate(
            { _id }, 
            { $inc: { wins: 1 } }, 
            { new: true } 
        );
        
console.log(updated);
        if (!updated) return res.status(404).json({ message: "User not found" });

        res.json({ message: "Win count updated", wins: updated.wins,data:[updated] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
const start=async (req, res) => {
    try {
        const { _id} = req.body;
        const find=await User.find({_id})
         
        

        if (!find) return res.status(404).json({ message: "User not found" });

        res.json({ message: "user find", wins:"",data:find, });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}


const addPost = async (req, res) => {
  try {
    console.log("Received Data:", req.body);  // Log incoming request

    const { email, type, url, caption,thumb } = req.body;

    if (!url || !type) {
      return res.status(400).json({ success: false, message: "Post URL and type are required" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $push: {
          posts: {
            type,
            url,
            thumb,
            caption:  caption || "",
            likes: 0,
            comments: [],
            createdAt: new Date(),
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log(" User Updated:", updatedUser);
    res.status(200).json({
      success: true,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} post added successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error(" Backend Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

  const like= async (req, res) => {
    const { id, email } = req.body;
  const _id=id;
    if (!_id || !email) {
      return res.status(400).json({ success: false, message: "Post ID and User Email are required!" });
    }
  
    try {
      const user = await User.findOne({"posts._id": _id});
      
  
      const post = user.posts.find((p) => p._id.toString() === _id);

      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found!" });
      }
      console.log(post)
      
      if (!post.likedby) {
        post.likedby = [];
      }
      const isLiked = post.likedby.includes(email);
  
      if (isLiked) {
        
        post.likes -= 1;
       post.likedby = post.likedby.filter(e => e !== email);

      } else {
        
        post.likes += 1;
        post.likedby.push(email);
      }
  
      await user.markModified("posts"); 
      await user.save(); 
      
      res.json({ success: true, message: isLiked ? "Post unliked!" : "Post liked!", likes: post.likes });
  
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  
  const comment=async (req, res) => {
    try {console.log(req.body)
      const { name, comment, id } = req.body;
  
      if (!name || !comment || !id) {
        return res.status(400).json({ error: "Name, comment, and post ID are required" });
      }
  
      
      const user = await User.findOne({ "posts._id": id });
  
      if (!user) {
        return res.status(404).json({ error: "Post not found" });
      }
  
  
      
      const post = user.posts.find((p) => p._id.toString() === id)
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      if (!post.comments) {
        post.comments = [];
      }
  
      
      post.comments.push({
        username: name,
        text: comment,
        createdAt: new Date(),
      });
      await user.markModified("posts")
      // Save the updated user document
      await user.save();
  
      res.json({ success: true, updatedPost: post,user:user,post:post });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

module.exports={loginUser,registerUser,password,get,usercount,start,addPost,like,comment}
