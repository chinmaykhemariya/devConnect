
const ConnectionRequest=require("../models/connectionRequestSchema")
const{subDays,endOfDay,startOfDay}=require("date-fns")
const cron = require('node-cron');
const sendEmailCommand=require("./sendEmail")
cron.schedule('10 8  * * *', async() => {
try{
    const yesterday=subDays(new Date(),1);
const yesterdayStart=startOfDay(yesterday);
const yesterdayEnd=endOfDay(yesterday);
let result =await ConnectionRequest.find({status:"interested",
    createdAt:{
        $gte:yesterdayStart,
        $lte:yesterdayEnd
    }   
}).select("toUserId").populate("toUserId","emailId");
let emailIds=new Set();
result.forEach((ele)=>{
    
    emailIds.add(ele.toUserId.emailId)})
    
    emailIds=Array.from(emailIds);
    console.log(emailIds)
    for(const i of emailIds){
      const result=await  sendEmailCommand.run()
    }
   
}
catch(err){
    console.log(err)
}
});