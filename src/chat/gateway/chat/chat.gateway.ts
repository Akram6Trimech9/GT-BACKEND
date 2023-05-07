import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UsersService } from 'src/users/services/users.service';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthService } from 'src/users/services/auth.service';
import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConnectedUserI } from 'src/chat/model/connected-user/connected-user-interface';
import { RoomI } from 'src/chat/model/room/room.interface';
import { RoomService } from 'src/chat/services/room/room.service';
import { ConnectedUserService } from 'src/chat/services/connected-user/connected-user';
import { JoinedRoomService } from 'src/chat/services/joined-room/joined-room.service';
import { MessageService } from 'src/chat/services/message/message.service';
import { UserI } from "src/users/entities/user.interface";
import { joinedRoomsI } from 'src/chat/model/joined-room/joined-room.interface';
import { messageI } from 'src/chat/model/message/message.interface';

@WebSocketGateway({cors:{origin:'http://localhost:4200'}})

export class ChatGateway implements   OnGatewayConnection, OnGatewayDisconnect , OnModuleInit{
   
  @WebSocketServer()
  server;

         constructor(private _auth: AuthService ,private  _userService : UsersService,
           private _roomService : RoomService,
            private  _connectedService : ConnectedUserService,
            private _joinedRoomService:  JoinedRoomService,
            private _messageService : MessageService ){

        }
  async  onModuleInit() {
    await this._connectedService.deleteAll()
    await this._joinedRoomService.deleteAll()
  }

 async  handleConnection(socket :Socket) {
  try{
    const decodetoken= await this._auth.verifyJwt(socket.handshake.headers.authorization) ;     
    const user: UserDto = await this._userService.getOne(decodetoken.sub)
    if(!user){
         return this.disconnect(socket)
    }else{
      socket.data.user= user ; 
      const rooms=    await  this._roomService.getRoomsForUser(user.id)
      await   this._connectedService.create({
          socketId: socket.id , 
          user : user
         })
       //emit rooms to the specifiq client
      return this.server.to(socket.id).emit('rooms',rooms)

    }
  }catch{
    return this.disconnect(socket)
  }
  }

  async handleDisconnect(socket : Socket) {
    await  this._connectedService.deleteBySocketId(socket.id,socket.data.user) 
   socket.disconnect()
  }

  
  private disconnect(socket : Socket){
    socket.emit('Error',new UnauthorizedException()) ;
    socket.disconnect();
  }
  
  @SubscribeMessage('createRoom')
    async  onCreateRoom(socket : Socket , room : RoomI)   {             
    const createdRoom= await this._roomService.createRoom(room , socket.data.user)
     
    for(const user of createdRoom.users){
      const connections : ConnectedUserI[]= await this._connectedService.findByUser(user) ;       
      const rooms = await this._roomService.getRoomsForUser(user.id)      
      for(const connection of connections){
         await this.server.to(connection.socketId).emit('rooms',rooms)
      }
    }
   }

  @SubscribeMessage('joinRoom') 
  async onJoinRoom(socket : Socket , room : RoomI){ 
     const messages= await this._messageService.findMessagesForRoom(room)     
      const  user : UserI = socket.data.user
      const joinedroomrecord : joinedRoomsI = { 
        socketId:  socket.id,
        user : user,
        room:room
      }
      await this._joinedRoomService.create(joinedroomrecord)
      await this.server.to(socket.id).emit('messages',messages)
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(socket : Socket){
    
   await  this._joinedRoomService.deleteBySocketId(socket.id)
  }

  @SubscribeMessage('addMessage')
    async onAddMessage(socket :Socket , message : messageI){ 
      const createdMessages : messageI =  await  this._messageService.create(
        {
          ...message ,
           user:  socket.data.user
        }
      )
      const room : RoomI = await this._roomService.getRoom(createdMessages.room.id)
      const JoinedUsers :joinedRoomsI[]= await this._joinedRoomService.findByRoom(room)
       
    for(const user of JoinedUsers){ 
       await this.server.to(user.socketId).emit('messageadded',createdMessages)
       
    }
  }
  
 
}
