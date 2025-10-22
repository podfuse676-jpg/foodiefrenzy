import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js'

import path from 'path';
import { fileURLToPath } from 'url';

import userRouter from './routes/userRoute.js'
import cartRouter from './routes/cartRoute.js'
import itemRouter from './routes/itemRoute.js';
import orderRouter from './routes/orderRoute.js';
import phoneAuthRouter from './routes/phoneAuthRoute.js';

const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MIDDLEWARE 
app.use(
    cors({
        origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Length', 'Content-Type']
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB CONNECT
connectDB();

// Routes
app.use('/api/user', userRouter)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/cart', cartRouter)
app.use('/api/items', itemRouter);
app.use('/api/orders', orderRouter);
app.use('/api/phone-auth', phoneAuthRouter);

app.get('/', (req, res) => {
    res.send('API WORKING');
})

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`)
})