import request from 'supertest';
import express from 'express';
import { createServer } from 'http';
import { Server, Socket as ServerSocket } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import cors from 'cors';

describe('Server', () => {
  let app: express.Application;
  let httpServer: ReturnType<typeof createServer>;
  let io: Server;
  let clientSocket: ClientSocket;
  const port = 3002;

  beforeEach((done) => {
    app = express();
    app.use(cors({
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    }));

    httpServer = createServer(app);
    io = new Server(httpServer, {
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    app.get('/', (req, res) => {
      res.send('ChatGenius Server Running');
    });

    httpServer.listen(port, () => {
      clientSocket = Client(`http://localhost:${port}`);
      clientSocket.on('connect', done);
    });
  });

  afterEach((done) => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
    io.close(() => {
      httpServer.close(() => {
        done();
      });
    });
  });

  it('should respond to health check', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('ChatGenius Server Running');
  });

  it('should have CORS configured correctly', async () => {
    const response = await request(app)
      .options('/')
      .set('Origin', 'http://localhost:3000')
      .set('Access-Control-Request-Method', 'POST');
    
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    expect(response.headers['access-control-allow-methods']).toContain('POST');
  });

  it('should establish Socket.IO connection', (done) => {
    expect(clientSocket.connected).toBe(true);
    done();
  });

  it('should handle client disconnection', async () => {
    expect(clientSocket.connected).toBe(true);
    clientSocket.disconnect();
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(clientSocket.connected).toBe(false);
  });
}); 