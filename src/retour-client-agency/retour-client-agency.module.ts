import { Module } from '@nestjs/common';
import { RetourClientAgencyService } from './retour-client-agency.service';
import { RetourClientAgencyController } from './retour-client-agency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RetourClientAgency } from './entities/retour-client-agency.entity';
import { UsersModule } from 'src/users/users.module';
import LocalFile from 'src/users/entities/localfile';

@Module({
  imports :[   
    TypeOrmModule.forFeature([RetourClientAgency,LocalFile]) , UsersModule 
  ],
  controllers: [RetourClientAgencyController],
  providers: [RetourClientAgencyService]
})
export class RetourClientAgencyModule {}
