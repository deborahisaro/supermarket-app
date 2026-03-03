import express from 'express';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productsRoutes.js'; // ← ADD THIS
import dotenv from 'dotenv';
import cors from 'cors'; // ← ADD THIS

dotenv.config();
connectDB();

const app = express();

app.use(cors()); // ← ADD THIS
app.use(express.json());
app.use(express.static('uploads')); // ← ADD THIS (serves uploaded images)

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/api/products', productRoutes); // ← ADD THIS

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
