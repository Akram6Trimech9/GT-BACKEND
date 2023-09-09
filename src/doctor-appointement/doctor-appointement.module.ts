import { Module } from '@nestjs/common';
import { DoctorAppointementService } from './doctor-appointement.service';
import { DoctorAppointementController } from './doctor-appointement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorAppointement } from './entities/doctor-appointement.entity';
import LocalFile from 'src/users/entities/localfile';

@Module({
  imports:[
    TypeOrmModule.forFeature([DoctorAppointement,LocalFile]) ,  
  ],
  controllers: [DoctorAppointementController],
  providers: [DoctorAppointementService]
})
export class DoctorAppointementModule {}
