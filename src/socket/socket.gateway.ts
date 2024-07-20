import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { INotifyClientContractUpdatedParams } from './socket.types';

@WebSocketGateway({
  cors: {
    origin: [
      process.env.WEB_APP_URL_ALINA,
      process.env.WEB_APP_URL_SNEZHANNA,
      process.env.WEB_APP_URL,
    ],
  },
})
export class SocketGateway {
  @WebSocketServer() server: Server;

  notifyClientContractUpdated(params: INotifyClientContractUpdatedParams) {
    this.server.emit('contract-updated', params);
  }
}
