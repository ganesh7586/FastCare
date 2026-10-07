import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './db/mongodb.js';
import connectCloudinary from './cloudinary.js';

import {createServer} from 'http';
import { Server } from 'socket.io';


dotenv.config();

const port = process.env.PORT || 4000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allows frontend (localhost:5173) and admin (localhost:5174)
        methods: ["GET", "POST"]
    }
});

// Map to track active online users/doctors: { userId: socketId }
const onlineUsers = new Map();

io.on('connection', (socket) => {
    // 1. User/Doctor passes their ID upon connection
    const { userId } = socket.handshake.query;
    if (userId) {
        onlineUsers.set(userId, socket.id);
        console.log(`User connected: ${userId} (Socket: ${socket.id})`);
    }

    // 2. Join a private conversation room
    socket.on('join_room', (conversationId) => {
        socket.join(conversationId);
        console.log(`Socket ${socket.id} joined room: ${conversationId}`);
    });

    // 3. Leave room (when switching chats)
    socket.on('leave_room', (conversationId) => {
        socket.leave(conversationId);
    });

    // 4. Handle sending a message in real time
    socket.on('send_message', (messageData) => {
        // Broadcast to everyone else in the conversation room
        socket.to(messageData.conversationId).emit('receive_message', messageData);

        // Also notify the receiver directly (for conversation list update / unread badge)
        const receiverSocketId = onlineUsers.get(messageData.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('new_message_notification', messageData);
        }
    });

    // 5. Typing indicators (optional bonus)
    socket.on('typing', ({ conversationId, senderId }) => {
        socket.to(conversationId).emit('user_typing', { senderId });
    });

    socket.on('stop_typing', ({ conversationId, senderId }) => {
        socket.to(conversationId).emit('user_stop_typing', { senderId });
    });

    // 6. Handle disconnect
    socket.on('disconnect', () => {
        if (userId) {
            onlineUsers.delete(userId);
            console.log(`User disconnected: ${userId}`);
        }
    });
});

const startServer = async () => {
    try {
        await connectDB();
        await connectCloudinary();

        httpServer.listen(port, () => {
            console.log(`Server running on port: ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message || error);
        process.exit(1);
    }
};

startServer();