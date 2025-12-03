const validator=require("validator")
const validateData=(req)=>{
let allowedKeys=["firstName","lastName","emailId","password","gender","age","skills","about"]
if(!(Object.keys(req.body).every((key)=>{return allowedKeys.includes(key)}))){
    throw new Error("extra fields are there")
}
if(!validator.isEmail(req.body?.emailId)){throw new Error("give valid email");
}
if(!validator.isStrongPassword(req.body?.password)){throw new Error("give valid password")}

}
const validateEditData=(req,res,next)=>{try{console.log(req.body)
    let allowedKeys=["firstName","lastName","skills","gender","age","photoUrl","about"];
    if(req.body?.photoUrl){
        if(!validator.isURL(req.body.photoUrl)){throw new Error("url is not correct")}
    }
  let isCorrect=  Object.keys(req.body).every((key)=>allowedKeys.includes(key));
  if(!isCorrect){
    throw new Error("invalid data")
  }
 
  next()}
  catch(err){res.status(400).send(err.message)}

}
module.exports={validateData,validateEditData}