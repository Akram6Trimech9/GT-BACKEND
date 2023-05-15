import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slider } from './entities/client-page/slider';
import { Comments } from './entities/client-page/comments';
import { AproposPageService } from './services/apropos-page/apropos-page.service';
 import { ServicesPageService } from './services/services-page/services-page.service';
import { ContactPageService } from './services/contact-blog/contact-page.service';
import { AproposPageController } from './controller/apropos-page/apropos-page.controller';
import { HomePageController } from './controller/home-page/home-page.controller';
 import { ServicesPageController } from './controller/services-page/services-page.controller';
import { ContactPageController } from './controller/contact-blog/contact-page.controller';
import { HomePageService } from './services/home-page/home-page.service';
import { Horaires } from './entities/client-page/horaires';
import LocalFile from 'src/users/entities/localfile';
 import { User } from 'src/users/entities/user.entity';
import { history } from './entities/apropos-page/history.entity';
import { AnswerQuestion } from './entities/apropos-page/faq-et-autres';
import { subscriber } from './entities/apropos-page/subscribers.entity';
import {  Interventions } from './entities/services-page/interventsion';
 import { UsersModule } from 'src/users/users.module';
import { AgencyInfo } from './entities/services-page/agency-info';
import { blog } from './entities/contact-blog/blog';
import { Contacts } from './entities/contact-blog/contact';

@Module({
  imports:[
     TypeOrmModule.forFeature([Slider,Comments,Horaires,LocalFile,User,history,AnswerQuestion,subscriber,Interventions,AgencyInfo,blog,Contacts]),
     UsersModule
  ], 
  controllers: [AproposPageController,HomePageController,ServicesPageController,ContactPageController],
  providers: [AproposPageService, HomePageService,ServicesPageService,ContactPageService]
})
export class ClientPageModule {}
