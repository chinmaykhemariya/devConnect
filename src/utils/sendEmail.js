const { SendEmailCommand }= require("@aws-sdk/client-ses");
const{ sesClient } =require( "./sesClient.js");
const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      
      CcAddresses: [
        
      ],
      ToAddresses: [
        toAddress,
       
      ],
    },
    Message: {

      Body: {
    
        Html: {
          Charset: "UTF-8",
          Data: "<h1>devConnect</h1>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "hi",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "send request",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
    
    ],
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
   process.env.EMAIL_ID,
    process.env.COMPANY_EMAIL_ID,
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};


module.exports= { run };