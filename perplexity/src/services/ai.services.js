import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

import { ChatMistralAI } from "@langchain/mistralai"

const model = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0,
    maxRetries: 2,
    apiKey:process.env.MISTRAL_API_KEY
})

export async function testAi() {
  try {
    const response = await model.invoke("what is the capital of france?");
    console.log("AI Answer:", response.content);
  } catch (error) {
    console.log("AI Error:", error);
  }
}