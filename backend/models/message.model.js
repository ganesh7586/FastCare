import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "conversation",
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    senderType: {
        type: String,
        enum: ["user", "doctor"],
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const messageModel = mongoose.models.message || mongoose.model("message", messageSchema);
export default messageModel;