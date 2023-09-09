import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UsersService } from 'src/users/services/users.service';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthService } from 'src/users/services/auth.service';
import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { CreateNotificationDto } from 'src/notification/dto/create-notification.dto';
import { Server } from 'http';


@WebSocketGateway({ cors: { origin: 'http://localhost:4200' } })

export class CallVideoGateway {

  @WebSocketServer()
  server;

  constructor(
    private _auth: AuthService,
    private _userService: UsersService) {

  }
  afterInit(server: Server) {
    console.log('Socket.io server initialized');
  }
 
  // @SubscribeMessage('callUser')
  // async handleCallUser(client: Socket, data: any) {
  //     console.log(data);
      
  //     // Ensure that the data and joinedUsers property exist
  //     if(data && data.joinedUsers && Array.isArray(data.joinedUsers)) {
  //         for(const user of data.joinedUsers) { 
  //             await this.server.to(user.socketId).emit('incomingCall', data);  
  //         }
  //     } else {
  //         console.error('Invalid data format or joinedUsers is missing');
  //     }
  // }
  

  @SubscribeMessage('acceptCall')
  handleAcceptCall(client: Socket, data: any): void {
    this.server.to(data.fromUserId).emit('callAccepted', { toUserId: data.toUserId });
  }

  @SubscribeMessage('declineCall')
  handleDeclineCall(client: Socket, data: any): void {
    this.server.to(data.fromUserId).emit('callDeclined', { toUserId: data.toUserId });
  }

 
}
