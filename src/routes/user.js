const express=require("express");
const router=express.Router({mergeParams:true});
const {validateData}=require("../utils/validation")
const bcrypt=require("bcryptjs")
const User=require("../models/userSchema")
const {userValidate}=require("../../middlewares/middleware")
const ConnectionRequest=require("../models/connectionRequestSchema")
let wantedData="firstName lastName age gender skills about photoUrl";
router.post("/signIn",async(req,res)=>{

     try{
        validateData(req)
        
        let{firstName,lastName,emailId,password,gender,age}=req.body;
        password=await bcrypt.hash(password, 10);
        let user1=new User({firstName,lastName,emailId,password,gender,age});
       
        let data=await user1.save();
        res.json({message:"signIn",data})
       
 }
   catch(err){
    res.send(err.message)
   }   
})

router.post("/login",async(req,res)=>{
   try{
    let{firstName,emailId,password}=req.body;
    
    let user=await User.findOne({emailId});
    
    if(!user){
        throw new Error("incorrect credentials")
    }
    
  let isUser= await user.comparePassword(password);
    
    if(isUser){
        let token =user.getJwt();
       
        console.log(token)
        return res.cookie("token",token,{expires:new Date(Date.now()+10*60*1000),maxAge:2*24*60*60*1000,httpOnly:true,secure:true}).json("succesfullyLogin")
    }
    throw new Error("incorrect credentials password")}
    catch(err){
        res.send(err.message)
    }
})
router.post("/logout",userValidate,(req,res)=>{

    console.log("loggingOutttt")
   
     res.clearCookie("token").send("logOut")

})

router.get("/requests/recieved",userValidate,async(req,res)=>{
    try{
    let user=req.user;
    
    let data =await ConnectionRequest.find({toUserId:user._id,status:"interested"}).populate("fromUserId",wantedData)
    console.log(data)
    res.json({message:"requests",data})}
    catch(err){
        res.send(err.message)
    }
})
router.get("/connections",userValidate,async(req,res)=>{
   try{
    let user=req.user;
       
    let data =await ConnectionRequest.find({$or:[{fromUserId:user._id,status:"accepted"},{toUserId:user._id,status:"accepted"}]}).populate("fromUserId",wantedData).populate("toUserId",wantedData)
    data=data.map((e)=>{
        if(e.fromUserId._id.equals(user._id)){ return {connectionId:e._id,connectedTo:e.toUserId}}
       else{ return{ connectionId:e._id,connectedTo:e.fromUserId}}
    })
    console.log(data)
    res.json({message:"connections",data})

   }
   catch(err){
    res.status(400).send(err.message)
   }
})
module.exports=router