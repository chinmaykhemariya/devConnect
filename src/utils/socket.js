const socket=require("socket.io");
const Chat=require("../models/chatSchema")
const intializeSocket=(server)=>{
const io=socket(server,{
    cors:{
        origin:"http://localhost:5173",
    },
});

io.on("connection",(socket)=>{

    socket.on("joinChat",(data)=>{
   
    let roomId=[data.user,data.chattingTo].sort().join("_");
      // socket.emit("joinChat",[]) chats
       
    socket.join(roomId);
   
    })
    socket.on("sendMessage",async(message)=>{try{
      
     let roomId=[message.from,message.to].sort().join("_"); 
       
    let chats=await Chat.findOne({participants:{$all:[message.from,message.to]}})
    if(!chats){console.log("insdie")
        chats=new Chat({participants:[message.from,message.to],messages:[]})
        
    }
   
        chats.messages.push({message:message.msg,sender:message.from})
        await chats.save()
    
   console.log(chats)
     io.to(roomId).emit("recievedMessages",{messages:chats.messages})}//chats
     catch(err){
        console.log(err.message)
     }
    })
     socket.on("disconnect",(reason)=>{console.log(reason)})
    
   
})
}
module.exports=intializeSocket;