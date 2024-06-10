import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  @WebSocketServer() server: Server;

  notifyClient(status: string, userId: number, url: string, message: string) {
    this.server.emit('notification', { status, userId, url, message });
  }
}
