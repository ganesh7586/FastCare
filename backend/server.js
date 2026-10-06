import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './db/mongodb.js';
import connectCloudinary from './cloudinary.js';

dotenv.config();

const port = process.env.PORT || 4000;

const startServer = async () => {
    try {
        await connectDB();
        await connectCloudinary();

        app.listen(port, () => {
            console.log(`Server running on port: ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message || error);
        process.exit(1);
    }
};

startServer();