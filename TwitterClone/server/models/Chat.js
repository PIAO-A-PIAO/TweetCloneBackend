import mongoose from "mongoose";
import User from "./User.js";
import Message from "./Message.js";

const ChatSchema = new mongoose.Schema({
    userIds: {
        type: Array,
        required: true
    },
    messageIds: {
        type: Array,
        default: []
    },
    chatIds: {
        type: Array,
        default: []
    }
}, { timestamps: true });

export default mongoose.model("Chat", ChatSchema);