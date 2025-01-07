import { Server } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import { AddressInfo } from 'net';
import { Socket as ClientSocket } from 'socket.io-client';
import { io as Client } from 'socket.io-client';
import { app } from './index';

describe('Server Tests', () => {
  let httpServer: HttpServer;
  let ioServer: Server;
  let clientSocket: ClientSocket;
  let port: number;

  beforeEach((done) => {
    httpServer = createServer(app);
    ioServer = new Server(httpServer);
    httpServer.listen(() => {
      port = (httpServer.address() as AddressInfo).port;
      clientSocket = Client(`http://localhost:${port}`);
      clientSocket.on('connect', done);
    });
  });

  afterEach(() => {
    ioServer.close();
    clientSocket.close();
    httpServer.close();
  });

  it('should respond to root endpoint', async () => {
    const response = await fetch(`http://localhost:${port}/`);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('ChatGenius Server Running');
  });

  it('should have CORS configured correctly', async () => {
    const response = await fetch(`http://localhost:${port}/`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
      },
    });
    expect(response.status).toBe(204);
    expect(response.headers.get('access-control-allow-origin')).toBe('http://localhost:3000');
  });

  it('should establish Socket.IO connection', (done) => {
    try {
      expect(clientSocket.connected).toBe(true);
      done();
    } catch (_error) {
      done(_error);
    }
  });

  it('should handle client disconnection', (done) => {
    clientSocket.on('disconnect', () => {
      expect(clientSocket.connected).toBe(false);
      done();
    });
    clientSocket.disconnect();
  });
});
