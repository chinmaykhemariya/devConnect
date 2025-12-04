const express=require("express");
const router=express.Router({mergeParams:true});
const validator=require("validator")
const User=require("../models/userSchema")
const bcrypt=require("bcryptjs")
const {validateEditData}=require("../utils/validation")
const {userValidate}=require("../../middlewares/middleware");
const multer=require("multer");
const{storage,cloudinary}=require("../utils/cloudinarySetup")
const upload=multer({storage});
router.get("/view",userValidate,async(req,res)=>{
    try{
//console.log(req.user);
  let  {firstName,lastName,gender,age,skills,about,photoUrl,_id}=req.user;
res.send({user: {firstName,lastName,gender,age,skills,about,photoUrl,_id}})


}catch(err){
   console.log(err)
}
})
router.patch("/edit",userValidate,upload.single('photoUrl'),validateEditData,async(req,res)=>{try{
 
let user=req.user;
Object.keys(req.body).forEach((key)=>user[key]=req.body[key])
if(req.file){
    user.photoUrl=req.file.path;
}

let result =await user.save()
  let  {firstName,lastName,gender,age,skills,about,photoUrl,_id}=result;
res.json({message:`${result.firstName} user is updated`,
    user:{firstName,lastName,gender,age,skills,about,photoUrl,_id}
})}
catch(err){
    console.log(err.message)
    res.status(400).send(err.message)
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