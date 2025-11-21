const mongoose=require("mongoose")
const{Schema,model}=mongoose;
const connectionRequestSchema=new Schema({
    fromUserId:{
        type:Schema.Types.ObjectId,ref:"User",
        required:true
    },
    toUserId:{
        type:Schema.Types.ObjectId,
        required:true,ref:"User",
        validate:{
            
            validator:function(value){
                
                if(value.toString()==this.fromUserId.toString()){return false}
                return true;
            },
        message:function(props){return `${props.value} is invalid entry`}
        }
    },
    status:{
        type:String,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:"only 4 status is possible {VALUE} is incorrect"
        },required:true
    }
},{timestamps:true}
);
connectionRequestSchema.pre("save",function(next){
    console.log(this.fromUserId.toString())
    if(this.fromUserId.equals(this.toUserId)){
        throw new Error("cant send request to yourself")
    }
    console.log(this);next()
})
connectionRequestSchema.index({fromUserId:1,toUserId:1})
module.exports=model("ConnectionRequest",connectionRequestSchema);