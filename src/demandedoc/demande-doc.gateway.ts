import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UsersService } from 'src/users/services/users.service';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthService } from 'src/users/services/auth.service';
import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
  
 import { NotificationService } from 'src/notification/notification.service';
import { CreateNotificationDto } from 'src/notification/dto/create-notification.dto';
  

@WebSocketGateway({cors:{origin:'http://localhost:4200'}})

export class demandeDocGateway implements   OnGatewayConnection, OnGatewayDisconnect , OnModuleInit{
   
  @WebSocketServer()
  server;

         constructor(
              private _notificationService : NotificationService ,
              private  _auth : AuthService , 
             private _userService : UsersService  ){

        }
  async  onModuleInit() {
  
  }
adminId : any 
adminInfo : any 
 async  handleConnection(socket :Socket) {
    try{
        const decodetoken= await this._auth.verifyJwt(socket.handshake.headers.authorization) ;     
        const user: UserDto = await this._userService.getOne(decodetoken.sub)
        if(!user){
         }else{
          socket.data.user= user ; 
              if(socket.data.user.role == 'admin'){
                 this.adminId = socket.id
                 this.adminInfo = user   
               }     
        }
      }catch{   }
      }
  async handleDisconnect(socket : Socket) {
    socket.disconnect()
  }

  
  private disconnect(socket : Socket){
    socket.emit('Error',new UnauthorizedException()) ;
    socket.disconnect();
  }
  
  @SubscribeMessage('createnewdocdemande')
    async  demandedoc(socket : Socket , user :any)   {   
      const admin = await this._userService.findAdmin();
         const createNotificationDto = new CreateNotificationDto()
        createNotificationDto.sender = admin
        createNotificationDto.reciever = user
        createNotificationDto.message = 'NEW DOC DEMANDE '        
      await      this.server.emit('newdoc',createNotificationDto)      
        await  this._notificationService.create(createNotificationDto) 
    
   }
}
