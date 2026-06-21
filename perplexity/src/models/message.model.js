import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: String,
      enum: ["user", "assistant", "system"],
      default: "user",
    },
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      default: "user",
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    tokens: {
      type: Number,
      default: 0,
    },
    embedding: {
      type: [Number],
      default: [],
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
)

const Message = mongoose.model("Message", messageSchema)
export default Message
