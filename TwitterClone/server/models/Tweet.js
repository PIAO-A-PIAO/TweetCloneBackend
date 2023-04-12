import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
        maxlength: 280
    },
    likes: {
        type: Array,
        default: []
    },
    isRetweeted: {
        type: Boolean,
        default: false
    },
    originalTweetId: {
        type: String
    },
    createdById: {
        type: String
    },
    createdAt: {
        type: Date
    }
}, { timestamps: true });

export default mongoose.model("Tweet", TweetSchema);