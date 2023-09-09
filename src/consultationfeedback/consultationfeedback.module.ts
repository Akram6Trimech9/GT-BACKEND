import { Module } from '@nestjs/common';
import { ConsultationfeedbackService } from './consultationfeedback.service';
import { ConsultationfeedbackController } from './consultationfeedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultationfeedback } from './entities/consultationfeedback.entity';
import { UsersModule } from 'src/users/users.module';
import { ConsultationsModule } from 'src/consultations/consultations.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Consultationfeedback  ]),
    UsersModule ,
    ConsultationsModule,
  ], 
  controllers: [ConsultationfeedbackController],
  providers: [ConsultationfeedbackService]
})
export class ConsultationfeedbackModule {}
