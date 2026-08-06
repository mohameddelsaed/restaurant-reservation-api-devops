import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Reservation } from './reservation.entity';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'reservations',
})
export class ReservationGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('joinAdmin')
  handleJoinAdmin(@ConnectedSocket() client: Socket) {
    client.join('admin_room');
    return { event: 'joined', message: 'Subscribed to admin reservation alerts' };
  }

  notifyReservationChange(data: any) {
    this.server.emit('reservationUpdated', data);
    this.server.to('admin_room').emit('reservationUpdated', data);
  }
}