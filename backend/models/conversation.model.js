import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    docId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctor",
        required: true
    },
    lastMessage: {
        type: String,
        default: ""
    },
    lastMessageSender: {
        type: String,
        default: ""
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

conversationSchema.index(
    { userId: 1, docId: 1 },
    { unique: true }
);

const conversationModel = mongoose.models.conversation || mongoose.model("conversation",conversationSchema);

export default conversationModel;