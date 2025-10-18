import express from 'express';
import http from 'http';          // <-- import http to create server
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import cookSnapRoutes from './routes/cookSnapRoutes.js';

import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js'
import { errorHandler } from './middleware/errorMiddleware.js';
import { setupSocket } from './socket.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // parse json
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/cooksnap', cookSnapRoutes);


// Health check
app.get('/', (req, res) => res.send('Tasteshare API is running'));

// Create HTTP server (wrap express app)
const server = http.createServer(app);

// Setup Socket.IO with HTTP server
setupSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Error handler (must be last)
app.use(errorHandler);
