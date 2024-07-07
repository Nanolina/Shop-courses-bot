import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
  INotifyClientContractUpdatedParams,
  INotifyClientVideoUploadedParams,
} from './socket.types';

@WebSocketGateway({
  cors: {
    origin: '*',
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
