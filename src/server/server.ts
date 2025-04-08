
import express from 'express';
import cors from 'cors';
import { connectDB } from './db/connection';
import { PORT } from './config';
import authRoutes from './routes/authRoutes';
import linkRoutes from './routes/linkRoutes';

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
