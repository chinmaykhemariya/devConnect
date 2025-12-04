const mongoose=require("mongoose");
const jwt=require("jsonwebtoken")
const validator=require("validator")
const bcrypt=require("bcryptjs")
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:[2,"very short firstname"],
        maxLength:[50,"too long firstname"]
    },
    lastName:{
        type:String,
        required:true,
         minLength:[2,"very short lastname"],
        maxLength:[50,"too long lastname"],
        required:true
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(value){
              if(!validator.isEmail(value)){throw new Error("email is not correct "+value)}
        }
    },
    password:{
        type:String,
        required:true,
        validate:(value)=>{
                if(!validator.isStrongPassword(value)){throw new Error("weak password ")}
        }
    },
    about:{
        type :String,
       default:"hey i am new here using dev connect",
       required:true,
        maxLength:[50,"too long description"],
      
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
        default:"https://plus.unsplash.com/premium_photo-1682023585957-f191203ab239?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dXNlciUyMGljb258ZW58MHx8MHx8fDA%3D",
        validate:(value)=>{
                if(!validator.isURL(value)){throw new Error("photo is not in correct format")}
        }
    },
    skills:
        {type:String,required:true,
        validate(value){
            if(value.length>50){throw new Error("you cant add more skills")}
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
    
    return await bcrypt.compare(password,this.password);
}


module.exports=mongoose.model("User",userSchema)