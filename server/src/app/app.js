import express from 'express';
import authRoutes from '../routes/auth.route.js';
import productRoutes from '../routes/product.route.js';
import cookieParser from 'cookie-parser';
import cartRoutes from '../routes/cart.route.js';

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim());

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

app.use(express.json());//(middleware)iske bina req.body me data read nhi kr pa rhe hote hai iska use jb body me row data bhjna hota hai 
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);

export default app;
