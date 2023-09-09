import { Module } from '@nestjs/common';
import { SendmessageService } from './sendmessage.service';
import { SendmessageController } from './sendmessage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sendmessage } from './entities/sendmessage.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Sendmessage]) , UsersModule 
  ],
  controllers: [SendmessageController],
  providers: [SendmessageService]
})
export class SendmessageModule {}
