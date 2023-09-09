import { Module } from '@nestjs/common';
import { RdvService } from './rdv.service';
import { RdvController } from './rdv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rdv } from './entities/rdv.entity';
import { RdvGateway } from './rdv.gateway';
import { UsersService } from 'src/users/services/users.service';
import { AuthService } from 'src/users/services/auth.service';
import LocalFile from 'src/users/entities/localfile';
import LocalFilesService from 'src/users/services/localfile.service';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationModule } from 'src/notification/notification.module';
import { UsersModule } from 'src/users/users.module';
 
@Module({
  imports :[   
    TypeOrmModule.forFeature([Rdv , LocalFile]),
     UsersModule ,
  NotificationModule],

    controllers: [RdvController],
  providers: [RdvService ,RdvGateway]
})
export class RdvModule {}
