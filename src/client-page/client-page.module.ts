import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slider } from './entities/slider';
import { Comments } from './entities/peopele-comments';
import { AproposPageService } from './services/apropos-page/apropos-page.service';
import { BlogPageService } from './services/blog-page/blog-page.service';
import { ServicesPageService } from './services/services-page/services-page.service';
import { ContactPageService } from './services/contact-page/contact-page.service';
import { AproposPageController } from './controller/apropos-page/apropos-page.controller';
import { HomePageController } from './controller/home-page/home-page.controller';
import { BlogPageController } from './controller/blog-page/blog-page.controller';
import { ServicesPageController } from './controller/services-page/services-page.controller';
import { ContactPageController } from './controller/contact-page/contact-page.controller';
import { HomePageService } from './services/home-page/home-page.service';
import { Horaires } from './entities/horaires';
import LocalFile from 'src/users/entities/localfile';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[
     TypeOrmModule.forFeature([Slider,Comments,Horaires,LocalFile]),
  ],
  controllers: [AproposPageController,HomePageController,BlogPageController,ServicesPageController,ContactPageController],
  providers: [AproposPageService, HomePageService,BlogPageService,ServicesPageService,ContactPageService]
})
export class ClientPageModule {}
