import readline from 'readline/promises';
import { ChatMistralAI } from "@langchain/mistralai";
import { configDotenv } from "dotenv";
import { HumanMessage,tool,createAgent } from 'langchain';
import { sendEmail } from './mail.services.js';
import * as z from "zod";
configDotenv();


const emailTool=tool(
  sendEmail,{
    name:"sendEmail",
    description:"use this tool to send email",
    schema:z.object({
      to:z.string().describe("recipient email address"),
      subject:z.string().describe("email subject"),
      html:z.string().describe("email content in html format"),
    })
  }
)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const model=new ChatMistralAI({
  model: "mistral-small-latest"
})


const agent=createAgent({
  model,
  tools: [emailTool],
})

const message=[];
while(true){
  const userInput=await rl.question("you: ")
  message.push(new HumanMessage(userInput))
  const response=await agent.invoke({messages:message})
  message.push(response.messages.length-1)

  console.log(response)
  console.log("AI: "+ response.text)
}

rl.close()