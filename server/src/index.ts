import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import pkg from 'pg';
const { Pool } = pkg;

export const app = express();
const port = process.env.PORT || 3001;

// Configure CORS
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || 'http://localhost:3000',
      'http://client:3000',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST'],
  }),
);

// Configure JSON parsing
app.use(express.json());

// Configure database connection
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/chatgenius',
});

// Configure Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      process.env.CLIENT_URL || 'http://localhost:3000',
      'http://client:3000',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  // eslint-disable-next-line no-console
  console.log('Client connected');
  socket.on('disconnect', () => {
    // eslint-disable-next-line no-console
    console.log('Client disconnected');
  });
});

// Root endpoint
app.get('/', (_req, res) => {
  res.send('ChatGenius Server Running');
});

// Health check endpoint
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'unhealthy', database: 'disconnected' });
  }
});

// Error handling middleware
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  const host = process.env.API_HOST || 'localhost';
  httpServer.listen({ port: Number(port), host }, () => {
    // eslint-disable-next-line no-console
    console.log(
      `Server running on ${host}:${port} in ${process.env.NODE_ENV || 'development'} mode`,
    );
  });
}
