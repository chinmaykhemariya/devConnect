const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../models/userSchema")
const ConnectionRequest=require("../models/connectionRequestSchema")
const {userValidate}=require("../../middlewares/middleware")
router.post("/send/:status/:toUserId",userValidate,async(req,res)=>{
    try{
    let {toUserId,status}=req.params;
    let fromUserId=req.user._id
  
    let toUser=await User.findById(toUserId);
    if(!toUser){
        throw new Error("reciever does not exist")
    }
    let allowedStatus=["interested","ignored"]
    if(!allowedStatus.includes(status)){
         throw new Error("invalid request "+status)}
   const prevConnection=await ConnectionRequest.findOne({$or:[{fromUserId,toUserId},{fromUserId:toUserId,toUserId:fromUserId}]});
   if(prevConnection){throw new Error("connection already exists")}
    const connection =new ConnectionRequest({fromUserId,toUserId,status});
    const data=await connection.save();
    return res.json({message:"connection send", data});
   }
    catch(err){res.send(err.message)}
})
router.patch("/review/:status/:requestId",userValidate,async(req,res)=>{try{
    let{status,requestId}=req.params;
    let user=req.user;
    let allowedStatus=["accepted","rejected"]
    if(!allowedStatus.includes(status)){
         throw new Error("invalid request "+status)
     }
    let request=await ConnectionRequest.findOne({_id:requestId,
    toUserId:user._id,
    status:"interested"
    });

    if(!request){
    throw new Error("no connection established")
    }
    request.status=status;
    let data=await request.save();
    res.json({message:`status updated to ${status}`,
    data
    })    
    }
     catch(err){
            res.send(err.message)
         }

})

module.exports=router