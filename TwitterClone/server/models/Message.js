import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    chatId: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Message", MessageSchema);