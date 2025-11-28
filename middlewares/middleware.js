const jwt=require("jsonwebtoken");
const User  = require("../src/models/userSchema");
const userValidate=async(req,res,next)=>{try{
let{token}=req.cookies;
console.log("useravlidate");
console.log(req.cookies)
if(!token){
   return res.status(401).send("unauthorized access")
   
}

user=jwt.verify(token,process.env.jwt);
newUser=await User.findById(user?._id);

if(newUser){
    req.user=newUser;
    return next()
}
throw new Error("user not found")

}
catch(err){
    res.status(401).send(err.message)
}
}
module.exports={
    userValidate
}