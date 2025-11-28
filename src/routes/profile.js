const express=require("express");
const router=express.Router({mergeParams:true});
const validator=require("validator")
const User=require("../models/userSchema")
const bcrypt=require("bcryptjs")
const {validateEditData}=require("../utils/validation")
const {userValidate}=require("../../middlewares/middleware")
router.get("/view",userValidate,async(req,res)=>{
    try{
console.log(req.user);
res.send({user:req.user})


}catch(err){
   console.log(err)
}
})
router.patch("/edit",userValidate,validateEditData,async(req,res)=>{try{
 
let user=req.user;
Object.keys(req.body).forEach((key)=>user[key]=req.body[key])

let result =await user.save()
res.json({message:`${result.firstName} user is updated`,
    user:result
})}
catch(err){
    res.send(err.message)
}

})
router.patch("/password",userValidate,async(req,res)=>{try{
    let {password}=req.body;
    if(password){
        if(!validator.isStrongPassword(password)){throw new Error("give valid password")};
      
       let salt=await bcrypt.genSalt(10);
       let hashPassword=await bcrypt.hash(password,salt)
       req.user.password=hashPassword;
       await req.user.save();
       res.send("password is updated")

    }}
    catch(err){
        res.send(err.message)
    }
})
module.exports=router