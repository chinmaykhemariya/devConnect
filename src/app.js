if(process.env.NODE_ENV !="production"){
require('dotenv').config()
}

const express=require("express");
const app=express();
const main =require("./config/database")

main().then((res)=>{console.log("mongodb connection established");
app.listen(3001,()=>{
    console.log("listening")
})
})
.catch(err => console.log("mongodb connection"+err));

