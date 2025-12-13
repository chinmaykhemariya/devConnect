if(process.env.NODE_ENV !="production"){
require('dotenv').config()
}
const cors=require("cors")
const cookieParser = require('cookie-parser')
const validateData=require("./utils/validation")
const validator=require("validator")
const express=require("express");
const app=express();
const http=require("http")
app.use(express.json())
const bcrypt=require("bcryptjs")
const main =require("./config/database")
const User=require("./models/userSchema")
app.use(cookieParser())

const jwt = require('jsonwebtoken');
const userRouter=require("./routes/user");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");
const chatRouter=require("./routes/chat");

const intializeSocket = require('./utils/socket')
app.use(cors(
    {origin:"http://localhost:5173",
        credentials:true
    }
))
app.use("/user",userRouter);
app.use("/profile",profileRouter)
app.use("/request",requestRouter);
app.use("/chat",chatRouter);

const server=http.createServer(app);
intializeSocket(server);

main().then((res)=>{console.log("mongodb connection established");
server.listen(3001,"0.0.0.0",()=>{
    console.log("listening")
})
})
.catch(err => console.log("mongodb connection"+err));

