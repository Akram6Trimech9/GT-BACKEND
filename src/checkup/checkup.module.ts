import { Module } from '@nestjs/common';
import { CheckupService } from './services/checkup.service';
import { CheckupController } from './controllers/checkup.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { checkupoffers } from './entities/checkkuparticles';
import { CheckupCategory } from './entities/checkup-category.entity';

@Module({
  imports:[    TypeOrmModule.forFeature([checkupoffers, CheckupCategory])] , 
  controllers: [CheckupController],
  providers: [CheckupService]
})
export class CheckupModule {}
