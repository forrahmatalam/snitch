import express from 'express';
import authRoutes from '../routes/auth.route.js';
import productRoutes from '../routes/product.route.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use((req, res, next) => {
    const clientUrl = process.env.CLIENT_URL;

    if (clientUrl && req.headers.origin === clientUrl) {
        res.header('Access-Control-Allow-Origin', clientUrl);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    }

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

app.use(express.json());//(middleware)iske bina req.body me data read nhi kr pa rhe hote hai iska use jb body me row data bhjna hota hai 
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);

export default app;
