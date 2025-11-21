const mongoose=require("mongoose");
const jwt=require("jsonwebtoken")
const validator=require("validator")
const bcrypt=require("bcryptjs")
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:[4,"very short name"],
        maxLength:[50,"too long"]
    },
    lastName:{
        type:String,
        uppercase:true,required:true,
         minLength:[4,"very short lastname"],
        maxLength:[50,"too long"],
        required:true
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(value){
              if(!validator.isEmail(value)){throw new Error("email is not correct from schema "+value)}
        }
    },
    password:{
        type:String,
        required:true,
        validate:(value)=>{
                if(!validator.isStrongPassword(value)){throw new Error("weak password is not correct")}
        }
    },
    about:{
        type :String,
       default:"hey i am new here using dev connect"
    },
    age:{
        type:Number,
        min:[18,"bada holey"],
    required:true
    },
    gender:{
        type:String,
        required:true,
        enum:["men","women","others"]
    },
    photoUrl:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s",
        validate:(value)=>{
                if(!validator.isURL(value)){throw new Error("url is not correct")}
        }
    },
    skills:
        {type:[String],
        validate(value){
            if(value.length>10){throw new Error("you cant add more skills")}
        }
        }
},
       {
            timestamps:true

        }
)
userSchema.methods.getJwt=function(){
    console.log("working within schema"+this.firstName)
return jwt.sign({_id:this._id,firstName:this.firstName},process.env.jwt,{expiresIn:"3h"})
}
userSchema.methods.comparePassword=async function(password){
    console.log("comparePassword")
    return await bcrypt.compare(password,this.password);
}


module.exports=mongoose.model("User",userSchema)