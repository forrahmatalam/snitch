import app from './app/app.js';
import connectDB from './config/db.js';

const startServer = async () => {
    await connectDB();

    const port = process.env.PORT || 3000;

    app.listen(port, '0.0.0.0', () => {
        console.log(`Server is running on port ${port}`);
    });
};

startServer().catch((error) => {
    console.error('Server failed to start:', error);
    process.exit(1);
});
