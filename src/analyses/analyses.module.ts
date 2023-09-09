import { Module } from '@nestjs/common';
import { AnalysesService } from './analyses.service';
import { AnalysesController } from './analyses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analysis } from './entities/analysis.entity';
import { UsersModule } from 'src/users/users.module';
import LocalFile from 'src/users/entities/localfile';
import { NotificationModule } from 'src/notification/notification.module';
import { AnalyseGateway } from './analyse.gateway';

@Module({
  imports:[    TypeOrmModule.forFeature([Analysis , LocalFile]) , UsersModule ,NotificationModule] , 
  controllers: [AnalysesController],
  providers: [AnalysesService ,AnalyseGateway]
})
export class AnalysesModule {}
