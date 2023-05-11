import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ClientPageModule } from './client-page/client-page.module';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { ChatModule } from './chat/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { connectedUserEntity } from './chat/model/connected-user/connected-user.entity';
import { MessageEntity } from './chat/model/message/message.entity';
import { JoinedRoomEntity } from './chat/model/joined-room/joined-room.entity';
import { Room } from './chat/model/room/room.entity';
import * as Joi from '@hapi/joi';
import LocalFile from './users/entities/localfile';
import { Slider } from './client-page/entities/slider';
import { Comments } from './client-page/entities/comments';
import { Horaires } from './client-page/entities/horaires';
@Module({
  imports: [ 
    UsersModule  , 
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'gt',
      entities: [User,connectedUserEntity,MessageEntity,JoinedRoomEntity,Room,LocalFile,Slider,Comments,Horaires],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        UPLOADED_FILES_DESTINATION: Joi.string().required(),
       })
    }),
    
    ClientPageModule,
     ChatModule  
    ],

  controllers: [AppController],
  providers: [AppService],
  
})
 export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/auth/refresh', method: RequestMethod.GET },
        { path: '/uploadedFiles/avatar/:filename', method: RequestMethod.GET },
        { path: '/uploadedFiles/slider/:filename', method: RequestMethod.GET },
        { path: '/email-confirmation/confirm', method: RequestMethod.POST },
        { path: '/users', method: RequestMethod.POST },
        { path: '/users/search', method: RequestMethod.POST },
        { path: '/home/slider', method: RequestMethod.POST },
        { path: '/home/slider', method: RequestMethod.GET },
        { path: '/local-files/:id', method: RequestMethod.GET },
        { path: '/local-files/:id', method: RequestMethod.GET },
        { path: '/users', method: RequestMethod.GET },
        { path: '/users/:id', method: RequestMethod.GET },
        { path: '/users/email/:email', method: RequestMethod.GET },
        { path: '/users/:id', method: RequestMethod.DELETE },
        { path: '/auth/login', method: RequestMethod.POST },
        { path: '/auth/register', method: RequestMethod.POST },
        { path: '/auth/logout', method: RequestMethod.POST },
        { path: '/reset/send', method: RequestMethod.POST },
        { path: '/reset/changepassword', method: RequestMethod.PATCH },
        { path: '/auth/facebook', method: RequestMethod.POST }, 
      )
      .forRoutes('');
  }
}
