import { Module } from '@nestjs/common';
import { DemandedocService } from './demandedoc.service';
import { DemandedocController } from './demandedoc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandeDoc } from './entities/demandedoc.entity';
import LocalFile from 'src/users/entities/localfile';
import { UsersModule } from 'src/users/users.module';
import { NotificationModule } from 'src/notification/notification.module';
import { demandeDocGateway } from './demande-doc.gateway';
import { AnswerDoc } from './entities/answerdemande.entity';

@Module({
  imports:[    TypeOrmModule.forFeature([DemandeDoc , LocalFile,AnswerDoc]) , UsersModule ,NotificationModule] , 
  controllers: [DemandedocController],
  providers: [DemandedocService , demandeDocGateway]
})
export class DemandedocModule {}
