const express=require("express");
const router=express.Router({mergeParams:true});
const {validateData}=require("../utils/validation")
const bcrypt=require("bcryptjs")
const User=require("../models/userSchema")
const {userValidate}=require("../../middlewares/middleware")
const ConnectionRequest=require("../models/connectionRequestSchema")
let wantedData="firstName lastName age gender skills about photoUrl";
router.post("/signup",async(req,res)=>{

     try{
        validateData(req)
        console.log(req.body)
        let{firstName,lastName,emailId,password,gender,age,about,skills}=req.body;
        password=await bcrypt.hash(password, 10);
        let user1=new User({firstName,lastName,emailId,password,gender,age,skills});
       
        let data=await user1.save();
        res.json({message:"signUp",data})
       
 }
   catch(err){
    res.status(400).send(err.message)
   }   
})

router.post("/login",async(req,res)=>{
   try{console.log(req.body)
    let{emailId,password}=req.body;
    
    let user=await User.findOne({emailId});
    
    if(!user){
        throw new Error("incorrect credentials")
    }
    
  let isUser= await user.comparePassword(password);
   
    if(isUser){
        let token =user.getJwt();
     let  {firstName,lastName,gender,age,skills,about,photoUrl,_id}=user;
        
        return res.cookie("token",token,{expires:new Date(Date.now()+10*60*1000),httpOnly:true,maxAge:2*24*60*60*1000,}).json({message:"succesfullyLogin",user:{firstName,lastName,gender,age,skills,about,photoUrl,_id}})
    }
    throw new Error("incorrect credentials password")}
    catch(err){
        res.status(401).send(err.message)
    }
})
router.post("/logout",userValidate,(req,res)=>{

    console.log("loggingOutttt")
   
     res.clearCookie("token").send("logOut")

})

router.get("/requests/recieved",userValidate,async(req,res)=>{
    try{
    let user=req.user;
    
    let data =await ConnectionRequest.find({toUserId:user._id,status:"interested"}).sort({createdAt:-1}).populate("fromUserId",wantedData)
    console.log(data)
    res.json({message:"requests",data})}
    catch(err){
        res.status(400).send(err.message)
    }
})
router.get("/connections",userValidate,async(req,res)=>{
   try{
    let user=req.user;
       
    let data =await ConnectionRequest.find({$or:[{fromUserId:user._id,status:"accepted"},{toUserId:user._id,status:"accepted"}]}).sort({updatedAt:-1}).populate("fromUserId",wantedData).populate("toUserId",wantedData)
    
    data=data.map((e)=>{
        if(e.fromUserId._id.equals(user._id)){ return {connectionId:e._id,connectedTo:e.toUserId}}
       else{ return{ connectionId:e._id,connectedTo:e.fromUserId}}
    })
    
    res.json({message:"connections",data})

   }
   catch(err){
    res.status(400).send(err.message)
   }
})
router.get("/connection/:chattingTo",userValidate,async(req,res)=>{
    try{ let user=req.user;
        let{chattingTo}=req.params;
         let data =await ConnectionRequest.find({$or:[{fromUserId:user._id,status:"accepted",toUserId:chattingTo},{toUserId:user._id,fromUserId:chattingTo,status:"accepted"}]}).sort({updatedAt:-1}).populate("fromUserId","firstName lastName photoUrl").populate("toUserId","firstName lastName photoUrl");

         data=data.map((e)=>{
        if(e.fromUserId._id.equals(user._id)){ return {connectionId:e._id,connectedTo:e.toUserId}}
       else{ return{ connectionId:e._id,connectedTo:e.fromUserId}}
    })
         res.send(data)
    }
    catch(err){console.log(err)}

})
router.get("/feed",userValidate,async(req,res)=>{
try{
    let page =parseInt(req.query.page)||1;
    let limit=parseInt(req.query.limit)||10;
    if(limit>30){limit=10}
    const user=req.user;
   
    let connections=await ConnectionRequest.find({$or:[{fromUserId:user._id},{toUserId:user._id}]}).select("fromUserId toUserId")
   
    let connectionsBlockList=new Set()
    connections.forEach((ele)=>{
        if(ele.fromUserId.equals(user._id)){connectionsBlockList.add(ele.toUserId)}
        else{connectionsBlockList.add(ele.fromUserId)}
    })
       connectionsBlockList.add(user._id)
     
    let showUsers=await User.find({_id:{$nin:Array.from(connectionsBlockList)}}).sort({updatedAt:-1}).skip((page-1)*limit).limit(limit).select(wantedData)
    res.json({feed:showUsers})
}
catch(err){
    res.status(400).json({message:err.message})
}
})

module.exports=router