if(process.env.NODE_ENV !="production"){
require('dotenv').config()
}
const cookieParser = require('cookie-parser')
const validateData=require("./utils/validation")
const validator=require("validator")
const express=require("express");
const app=express();
app.use(express.json())
const bcrypt=require("bcryptjs")
const main =require("./config/database")
const User=require("./models/userSchema")
app.use(cookieParser())

const jwt = require('jsonwebtoken');
const userRouter=require("./routes/user");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");

app.use("/user",userRouter);
app.use("/profile",profileRouter)
app.use("/request",requestRouter)

main().then((res)=>{console.log("mongodb connection established");
app.listen(3001,()=>{
    console.log("listening")
})
})
.catch(err => console.log("mongodb connection"+err));

