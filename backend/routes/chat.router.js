import express from "express";
import { sendMessage, getMessage, getOrCreateconversation, getDoctorConversation, getUserConversation } from "../controllers/chat.controllers.js";
import authUser from "../middleware/authUser.js";
import authDoctor from "../middleware/authDoctor.js";

const chatRouter = express.Router();

chatRouter.get('/user/conversations',authUser,getUserConversation);
chatRouter.get('/user/start/:docId',authUser,getOrCreateconversation);
//auth doctor
chatRouter.get('/doctor/conversations',authDoctor,getDoctorConversation);

chatRouter.get('/message/:conversationId',getMessage);


const authAny = (req, res, next) => {
    const { token, dtoken } = req.headers;
    if (dtoken) return authDoctor(req, res, next);
    return authUser(req, res, next);
};

chatRouter.post('/send',authAny,sendMessage);


export default chatRouter;