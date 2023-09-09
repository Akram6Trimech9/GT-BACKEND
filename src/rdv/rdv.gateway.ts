import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UsersService } from 'src/users/services/users.service';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthService } from 'src/users/services/auth.service';
import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
  
import { RdvService } from './rdv.service';
import { NotificationService } from 'src/notification/notification.service';
import { CreateNotificationDto } from 'src/notification/dto/create-notification.dto';
 

@WebSocketGateway({cors:{origin:'http://localhost:4200'}})

export class RdvGateway implements   OnGatewayConnection, OnGatewayDisconnect , OnModuleInit{
   
  @WebSocketServer()
  server;

         constructor(
             private _rdvService : RdvService , 
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
      }catch{
       }
      }
    
 
  async handleDisconnect(socket : Socket) {
    socket.disconnect()
  }

  
  private disconnect(socket : Socket){
    socket.emit('Error',new UnauthorizedException()) ;
    socket.disconnect();
  }
  
  @SubscribeMessage('createRdv')
    async  onCreateRoom(socket : Socket , user :any)   {   
      const admin = await this._userService.findAdmin();
       const createNotificationDto = new CreateNotificationDto()
          createNotificationDto.sender = user
          createNotificationDto.reciever = admin
          createNotificationDto.message = `NEW RENDEZ VOUS BY ${user.firstName} - ${user.lastName} `
       await      this.server.to(this.adminId).emit('createdRdv',createNotificationDto)
          await  this._notificationService.create(createNotificationDto) 
   }

   @SubscribeMessage('telecharger')
   async  doctelercharger(socket : Socket , data :any)   {   
      const admin = await this._userService.findAdmin();
     const createNotificationDto = new CreateNotificationDto()
         createNotificationDto.sender = data.sender
         createNotificationDto.reciever = admin
         createNotificationDto.message = `ANALYSE ${ data.analyse } TELECHARGER PAR ${ data.sender.firstName}  - ${ data.sender.lastName} `
       await      this.server.to(this.adminId).emit('analysealert',createNotificationDto)
         await  this._notificationService.create(createNotificationDto) 
  }

  @SubscribeMessage('newfeedback')
  async  feedback(socket : Socket , data :any)   {   
    const admin = await this._userService.findAdmin();
     const createNotificationDto = new CreateNotificationDto()
        createNotificationDto.sender = data.doctor
        createNotificationDto.reciever = admin
        createNotificationDto.message = `NEW FEEDBACK BY DOCTOR  ${data.doctor.firstName}  `
     await      this.server.to(this.adminId).emit('doctorfeedback',createNotificationDto)
        await  this._notificationService.create(createNotificationDto) 
 }
 @SubscribeMessage('sendedmessage')
 async  sendmessage(socket : Socket , data :any)   {   
   const admin = await this._userService.findAdmin();
    const createNotificationDto = new CreateNotificationDto()
       createNotificationDto.sender = data.patient
       createNotificationDto.reciever = admin
       createNotificationDto.message = `NEW MESSAGE FROM A PATIENT  ${data.patient.firstName}    ${data.patient.lastName}   `
    await      this.server.to(this.adminId).emit('messagefromaclient',createNotificationDto)
       await  this._notificationService.create(createNotificationDto) 
}
@SubscribeMessage('senddoctorappointment')
async  doctorappointement(socket : Socket , data :any)   {  
  const admin = await this._userService.findAdmin();
   const createNotificationDto = new CreateNotificationDto()
      createNotificationDto.sender = admin
      createNotificationDto.reciever = data.reciever.id
      createNotificationDto.message = `NEW JOB  FROM AGENCY `
      console.log(createNotificationDto);
   await      this.server.emit('doctorappointment',createNotificationDto)
      await  this._notificationService.create(createNotificationDto) 
}
@SubscribeMessage('newpatient')
async  newpatient(socket : Socket , data :any)   {  
   const admin = await this._userService.findAdmin();
   const createNotificationDto = new CreateNotificationDto()
      createNotificationDto.sender = admin
      createNotificationDto.reciever = data.reciever
      createNotificationDto.message = `NEW PATIENT CALLED ${data.patient.firstName} ${data.patient.lastName}  HAS BEEN ADD  TO YOURS `
    await      this.server.emit('getnewpatient',createNotificationDto)
      await  this._notificationService.create(createNotificationDto) 
}

}
