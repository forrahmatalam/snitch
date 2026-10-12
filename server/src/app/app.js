import express from 'express';
import cors from 'cors';
import authRoutes from '../routes/auth.route.js';
import productRoutes from '../routes/product.route.js';
import cookieParser from 'cookie-parser';
import cartRoutes from '../routes/cart.route.js';
import paymentRoutes from '../routes/payment.route.js';
import Razorpay from 'razorpay';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

// Instantiate Razorpay
export const instance = new Razorpay({
    key_id: process.env.RAZOR_KEY_ID,
    key_secret: process.env.RAZOR_SECRET_KEY
});

app.use(express.json());//(middleware)iske bina req.body me data read nhi kr pa rhe hote hai iska use jb body me row data bhjna hota hai 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
// Payment routes 
app.use("/api", paymentRoutes);




export default app;
