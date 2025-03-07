const User =require('./user');

const jwt = require("jsonwebtoken");



const registerUser=async (req ,res)=>{
    try{
        console.log(req.body)
        const {name,email,password,number,address}=req.body;
        const hashedPassword = password;
        const checkexistinguser= await User.findOne({$or:[{email}]})
        if(checkexistinguser){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        const newlycreateduser =await  User.insertMany({name,email,password:hashedPassword,number,address})
        
        if(newlycreateduser){
            res.status(201).json({
                success:true,
                message:"registered succefully"
            })
        }else{
            console.log("couldn't register")
        }

    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:'Some error'
        })
    }
}
const loginUser=async (req ,res)=>{
    try{
        const {email,password}=req.body ;
        const user= await User.findOne({email});
        if(!user){
            return res.status(400).json({status:"false",
                message:"user doesn,t exist"
            })
        }
        console.log(user)
        
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    
        const token = jwt.sign({ id: user._id }, "b81e9ab305130c87118bc792fdbbf1a73b732c659ff2b7742f7bd41aca1315a2", { expiresIn: "1h" });
        res.json({ token, user: { username: user.username, email: user.email } });

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