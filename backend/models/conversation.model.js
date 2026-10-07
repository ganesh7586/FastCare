import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:"true"
    },
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"doctor",
        required:true
    },
    lastMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"message",
        default:null
    },
    lastMessageAt:{
        type:Date,
        default:null
    },
    timestamps:true
});


conversationSchema.index(
    {patient:1,doctor:1},
    {unique:true}
);

const conversationModel = mongoose.models.conversation || mongoose.model("conversation",conversationSchema);

export default conversationModel;