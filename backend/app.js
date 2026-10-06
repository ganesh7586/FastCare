import express from 'express';
import cors from 'cors';
import adminRouter from './routes/admin.router.js';
import doctorRouter from './routes/doctor.router.js';
import userRouter from './routes/user.router.js';

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// api endpoints
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user',userRouter)

app.get('/', (req, res) => {
    res.send('API Working');
});

export default app;
