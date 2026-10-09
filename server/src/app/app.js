import express from 'express';
import authRoutes from '../routes/auth.route.js';
import productRoutes from '../routes/product.route.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());//(middleware)iske bina req.body me data read nhi kr pa rhe hote hai iska use jb body me row data bhjna hota hai 
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);

export default app;
