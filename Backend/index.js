import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectDB.js';
import userRoutes from './routes/user.js';
import postRoutes from './routes/post.js';
import cors from 'cors';
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors({ 
    origin: 'http://localhost:5173', 
    credentials: true 
}))

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies for JWT

// Routes
app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.use('/api/users', userRoutes);
app.use('/api', postRoutes); // Mount post routes under /api

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});