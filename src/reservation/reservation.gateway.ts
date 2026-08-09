import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'reservations',
})
export class ReservationGateway {
  @WebSocketServer()
  server!: Server;

  notifyReservationChange() {
    this.server.emit('reservation-updates');
  }
}
