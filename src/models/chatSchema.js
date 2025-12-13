const {Schema,model} =require("mongoose");
const messageSchema=new Schema({
    sender:{type:Schema.Types.ObjectId,ref:"User",required:true},
    message:{type:String,required:true}

},{timestamps:true})
const chatSchema=new Schema({
    participants:[{type:Schema.Types.ObjectId,ref:"User",required:true}],
    messages:[messageSchema]

})
module.exports= model("Chat",chatSchema);