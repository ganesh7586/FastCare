import conversationModel from "../models/conversation.model.js";
import messageModel from "../models/message.model.js";
import doctorModel from "../models/doctor.model.js";
import userModel from "../models/user.model.js";

export const getOrCreateconversation = async (req, res) => {
    try {
        const { userId } = req.body;
        const { docId } = req.params;
        
        if (!docId) {
            return res.json({
                success: false,
                message: "DoctorId required"
            });
        }

        let conversation = await conversationModel.findOne({ userId, docId })
            .populate("docId", "name image speciality available")
            .populate("userId", "name image email phone");
        
        if (!conversation) {
            conversation = await conversationModel.create({ userId, docId });
            conversation = await conversationModel.findById(conversation._id)
                .populate("docId", "name image speciality available")
                .populate("userId", "name image email phone");
        }
        res.json({ success: true, conversation });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const getUserConversation = async (req, res) => {
    try {
        const { userId } = req.body;
        const conversations = await conversationModel.find({ userId })
            .populate("docId", "name image speciality")
            .sort({ lastMessageAt: -1 });

        res.json({ success: true, conversations });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const getDoctorConversation = async (req, res) => {
    try {
        const { docId } = req.body;
        const conversations = await conversationModel.find({ docId })
            .populate("userId", "name image email phone")
            .sort({ lastMessageAt: -1 });

        res.json({ success: true, conversations });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const getMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const message = await messageModel.find({ conversationId })
            .sort({ createdAt: 1 });

        res.json({ success: true, message });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { conversationId, text, receiverId } = req.body;
        // Check whether request came through authUser (req.userId) or authDoctor (req.docId)
        const senderId = req.userId || req.docId;
        const senderType = req.userId ? "user" : "doctor";
        
        if (!conversationId || !text || !receiverId) {
            return res.json({ success: false, message: "Missing required fields" });
        }
        
        const newMessage = await messageModel.create({
            conversationId,
            senderId,
            senderType,
            receiverId,
            text
        });
        
        // Update conversation summary
        await conversationModel.findByIdAndUpdate(conversationId, {
            lastMessage: text,
            lastMessageSender: senderType,
            lastMessageAt: new Date()
        });
        
        res.json({ success: true, message: newMessage });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};