const User =require('./user');

const jwt = require("jsonwebtoken");
const crypto = require("crypto"); 

const cloudinary = require("cloudinary").v2;
// Ensure correct path to User model
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
      console.log("✅ Incoming Request Body:", req.body);
      
      const { name, email, password, number, image } = req.body;
  
      if (!name || !email || !password || !number || !image) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }
  
      // ✅ Securely hash the password
      const hashedPassword = password;
  
      // ✅ Upload base64 image to Cloudinary
      
    // Generate a secure Cloudinary signature
    const { timestamp, signature } = generateSignature();

    // Upload image to Cloudinary using secure signed request
    const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "user_profiles",
      });

    if (!uploadResponse.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }

      // ✅ Create new user
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        number,
        image: uploadResponse.secure_url, // ✅ Store Cloudinary URL
      });
  
      console.log("✅ User Created:", newUser);
  
      res.status(201).json({
        data:[newUser],
        success: true,
        message: "Registered successfully",
      });
    } catch (error) {
      console.error("❌ Registration Error:", error);
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
            { _id }, // Find the user by email
            { $inc: { wins: 1 } }, // Increment wins by 1
            { new: true } // Return updated document
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


module.exports={loginUser,registerUser,password,get,usercount,start}
