 import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LocalFile from 'src/users/entities/localfile';
import { User } from 'src/users/entities/user.entity';
 import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { connectedUserEntity } from './model/connected-user/connected-user.entity';
import { JoinedRoomEntity } from './model/joined-room/joined-room.entity';
import { MessageEntity } from './model/message/message.entity';
import { Room } from './model/room/room.entity';
  import { ConnectedUserService } from './services/connected-user/connected-user';
import { JoinedRoomService } from './services/joined-room/joined-room.service';
import { MessageService } from './services/message/message.service';
import { RoomService } from './services/room/room.service';
 
@Module({
   imports:[UsersModule,
    TypeOrmModule.forFeature([connectedUserEntity,MessageEntity,JoinedRoomEntity,Room,User,LocalFile]),

],
  providers: [ChatGateway , RoomService,ConnectedUserService , JoinedRoomService, MessageService],
})
export class ChatModule {}
