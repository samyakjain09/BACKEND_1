import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "New chat",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    model: {
      type: String,
      enum: ["gpt-4", "gpt-3.5-turbo", "custom"],
      default: "gpt-4",
    },
    metadata: {
      type: Object,
      default: {},
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    pinned: {
      type: Boolean,
      default: false,
    },
    lastMessage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

const Chat = mongoose.model("Chat", chatSchema)
export default Chat
