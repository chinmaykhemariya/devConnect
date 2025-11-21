const jwt=require("jsonwebtoken");
const User  = require("../src/models/userSchema");
const userValidate=async(req,res,next)=>{try{
let{token}=req.cookies;
if(!token){
    throw new Error("please login");
}
console.log(token)
user=jwt.verify(token,process.env.jwt);
newUser=await User.findById(user?._id);

if(newUser){
    req.user=newUser;
    return next()
}
throw new Error("user not found")

}
catch(err){
    res.send(err.message)
}
}
module.exports={
    userValidate
}