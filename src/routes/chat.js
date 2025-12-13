const express=require("express")
const router=express.Router();

const {userValidate}=require("../../middlewares/middleware");
const Chat=require("../models/chatSchema")
router.get("/:chattingTo",userValidate,async(req,res)=>{
let {chattingTo}=req.params;

let userId=req.user._id;

let chat=await Chat.findOne({participants:{$all:[chattingTo,userId]}});

if(!chat){
    return res.json({messages:[]})
}
res.json({messages:chat.messages})
})
module.exports=router;