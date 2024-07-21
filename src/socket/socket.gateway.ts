import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { config } from 'dotenv';
import { Server } from 'socket.io';
import {
  INotifyClientContractUpdatedParams,
  INotifyClientVideoUploadedParams,
} from './socket.types';
config();

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

  notifyClientVideoUploaded(params: INotifyClientVideoUploadedParams) {
    this.server.emit('video-uploaded', params);
  }

  notifyClientContractUpdated(params: INotifyClientContractUpdatedParams) {
    this.server.emit('contract-updated', params);
  }
}
