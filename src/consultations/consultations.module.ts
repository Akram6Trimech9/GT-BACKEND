import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LocalFile from 'src/users/entities/localfile';
 import { UsersModule } from 'src/users/users.module';
 import { ConsultationsController } from './consultations.controller';
import { ConsultationService } from './consultations.service';
import { Consultation } from './entities/consultation.entity';
@Module({
  imports:[
    TypeOrmModule.forFeature([Consultation,LocalFile]),
    UsersModule
 ], 
  controllers: [ConsultationsController],
  providers: [ConsultationService]
  ,exports:[
    ConsultationService
   ]
})
export class ConsultationsModule {}
