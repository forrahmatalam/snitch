import express from 'express';
import cors from 'cors';
import authRoutes from '../routes/auth.route.js';
import productRoutes from '../routes/product.route.js';
import cookieParser from 'cookie-parser';
import cartRoutes from '../routes/cart.route.js';
import paymentRoutes from '../routes/payment.route.js';
import Razorpay from 'razorpay';
import config from '../config/config.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

// Keep the API bootable if payment credentials have not been added to the host yet.
export const instance = config.RAZOR_KEY_ID && config.RAZOR_SECRET_KEY
    ? new Razorpay({
        key_id: config.RAZOR_KEY_ID,
        key_secret: config.RAZOR_SECRET_KEY
    })
    : null;

app.use(express.json());//(middleware)iske bina req.body me data read nhi kr pa rhe hote hai iska use jb body me row data bhjna hota hai 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
// Payment routes 
app.use("/api", paymentRoutes);




export default app;
