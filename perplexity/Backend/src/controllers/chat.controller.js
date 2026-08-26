import { log } from "console";
import { generateResponse, generateChatTitle, testAi } from "../services/ai.services.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";


export async function sendMessage(req, res) {

    const { message, chat: chatId } = req.body

    let title = null, chat = null;
    if (!chatId) {
        title = await generateChatTitle(message);
        chat = await chatModel.create({
            user: req.user.id,
            title
        })
    }

    const userMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: message,
        role: 'user'
    })

    // Get conversation history for agent context
    const chatHistory = await messageModel.find({ chat: chatId || chat._id });
    
    // Convert to LangChain message format
    const { HumanMessage, AIMessage } = await import("langchain");
    const messageHistory = chatHistory.map(msg => 
        msg.role === 'user' ? 
        new HumanMessage(msg.content) : 
        new AIMessage(msg.content)
    );

    // Use agent with tools (will auto-use emailTool or tavilyTool if needed)
    const result = await testAi(message, messageHistory);

    const aiMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: result,
        role: 'ai'
    })

    res.status(201).json({
        aiMessage: result,
        title,
        chat,
        userMessage,
        aiMessage,
    })

 }

export async function getChats(req, res) {
    const user = req.user
    const chats = await chatModel.find({ user: user.id })
    res.status(200).json({
        messages: "Chats retrived successfully",
        chats,
    })
}

export async function getMessages(req, res) {
    const { chatId } = req.params

    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id
    })
    

    if (!chat) {
        return res.status(400).json({
            message: "Chat not found",
            success: false,
            err: "Chat not found"
        })
    }

    const messages = await messageModel.find({
        chat: chatId
    })
    res.status(200).json({
        message: "Messages retrived successfully",
        messages,
    })

}

export async function deleteChat(req, res) {
    const { chatId } = req.params
    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })
    await messageModel.deleteMany({
        chat: chatId
    })

    if (!chat) {
        return res.status(400).json({
            message: "Chat not found",
            success: false,
            err: "Chat not found"
        })
    }
    res.status(200).json({
        messages: "Chat deleted successfully",
        chat,
    })
}

export async function deleteMessage(req, res) {
    const { messageId } = req.params
    const message = await messageModel.findOneAndDelete({
        _id: messageId,
        user: req.user.id
    })
    await messageModel.deleteMany({
        chat: message.chat
    })

    if (!message) {
        return res.status(400).json({
            message: "Message not found",
            success: false,
            err: "Message not found"
        })
    }
    res.status(200).json({
        messages: "Message deleted successfully",
        message,
    })

    
}
