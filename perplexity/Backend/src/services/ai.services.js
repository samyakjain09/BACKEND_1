import "dotenv/config";
import readline from "readline/promises";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"
import { createAgent, HumanMessage, SystemMessage, AIMessage, tool } from "langchain";
import { sendEmail } from "./mail.services.js";
import * as z from "zod"
import { TavilySearch } from '@langchain/tavily'


const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY
});

export async function generateResponse(message) {
  const response = await geminiModel.invoke(message.map(msg => {
    if (msg.role === 'user') {
      return new HumanMessage(msg.content)
    }
    else if (msg.role === 'ai') {
      return new AIMessage(msg.content)
    }
  }))
  return response.text
}

export async function generateChatTitle(message) {

  const response = await mistralModel.invoke([
    new SystemMessage(`You are a helpful assistant that generates a title for a chat conversation. The title should be short, informative, and engaging. The conversation should be clear, relevent,and engaging giving user a quik understanding of the conversation.`),

    new HumanMessage(`Genrate a title for a chat conversation based on the following first message : ${message}`),
  ])
  return response.text

}






const emailTool = tool(
  sendEmail,
  {
    name: "emailTool",
    description: "use this tool to send an email",
    schema: z.object({
      to: z.string().describe("The recipient's email address"),
      subject: z.string().describe("The subject of the email"),
      html: z.string().describe("The HTML content of the email"),
    })
  }
)

const tavilySearch = new TavilySearch({
  maxResults: 5,
  tavilyApiKey: process.env.TAVILY_API_KEY,
  topic: "general",
});

const tavilyTool = tool(
  async ({ query }) => {
    const result = await tavilySearch.invoke({ query });
    return typeof result === "string" ? result : JSON.stringify(result);
  },
  {
    name: "tavilyTool",
    description: "use this tool to search for the latest, real-time information from the web. Essential for current events, news, or time-sensitive data.",
    schema: z.object({
      query: z.string().describe("The specific search query. Include words like 'latest', 'today', or the current year for better results."),
    }),
  }
);

const agent = createAgent({
  model: geminiModel,
  tools: [emailTool, tavilyTool],
});

export async function testAi(userInput, conversationHistory = []) {
  try {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Build message history for the agent
    const messages = [
      new SystemMessage(`You are a helpful assistant. For any questions about current events, recent news, latest information, today's date, or time-sensitive data, ALWAYS use the tavilyTool to search for the latest information. Today's date is ${currentDate}.`),
      ...conversationHistory,
      new HumanMessage(userInput)
    ];

    const response = await agent.invoke({
      messages: messages,
    });

    return response.messages[response.messages.length - 1].content;
  } catch (error) {
    if (error?.status === 429) {
      return "Gemini API quota exceeded.";
    }

    if (error?.status === 404) {
      return "Selected Gemini model not found.";
    }

    return `Error: ${error.message}`;
  }
}

