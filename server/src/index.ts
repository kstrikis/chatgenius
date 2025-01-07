import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { initializeDatabase } from './db/index.js';

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
}));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.send('ChatGenius Server Running');
});

app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await initializeDatabase();
    res.json({
      status: 'healthy',
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

io.on('connection', (socket) => {
  // eslint-disable-next-line no-console
  console.log('Client connected');

  socket.on('disconnect', () => {
    // eslint-disable-next-line no-console
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});
