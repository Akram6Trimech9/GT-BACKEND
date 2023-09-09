import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ClientPageModule } from './client-page/client-page.module';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { ChatModule } from './chat/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { connectedUserEntity } from './chat/model/connected-user/connected-user.entity';
import { MessageEntity } from './chat/model/message/message.entity';
import { JoinedRoomEntity } from './chat/model/joined-room/joined-room.entity';
import { Room } from './chat/model/room/room.entity';
import * as Joi from '@hapi/joi';
import LocalFile from './users/entities/localfile';
import { Slider } from './client-page/entities/client-page/slider';
import { Comments } from './client-page/entities/client-page/comments';
import { Horaires } from './client-page/entities/client-page/horaires';
import { history } from './client-page/entities/apropos-page/history.entity';
import { AnswerQuestion } from './client-page/entities/apropos-page/faq-et-autres';
import { subscriber } from './client-page/entities/apropos-page/subscribers.entity';
import { AgencyInfo } from './client-page/entities/services-page/agency-info';
import { Interventions } from './client-page/entities/services-page/interventsion';
import { blog } from './client-page/entities/contact-blog/blog';
import { Contacts } from './client-page/entities/contact-blog/contact';
 import { DemandedocModule } from './demandedoc/demandedoc.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { RdvModule } from './rdv/rdv.module';
import { ClientContactModule } from './client-contact/client-contact.module';
import { DocumentsModule } from './documents/documents.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { Rdv } from './rdv/entities/rdv.entity';
import { NotificationModule } from './notification/notification.module';
import { Notification } from './notification/entities/notification.entity';
import { Consultation } from './consultations/entities/consultation.entity';
import { CheckupModule } from './checkup/checkup.module';
import { CheckupCategory } from './checkup/entities/checkup-category.entity';
import { checkupoffers } from './checkup/entities/checkkuparticles';
import { AnalysesModule } from './analyses/analyses.module';
import { Analysis } from './analyses/entities/analysis.entity';
import { DemandeDoc } from './demandedoc/entities/demandedoc.entity';
import { AnswerDoc } from './demandedoc/entities/answerdemande.entity';
import { ConsultationfeedbackModule } from './consultationfeedback/consultationfeedback.module';
import { Consultationfeedback } from './consultationfeedback/entities/consultationfeedback.entity';
import { RetourClientAgencyModule } from './retour-client-agency/retour-client-agency.module';
import { RetourClientAgency } from './retour-client-agency/entities/retour-client-agency.entity';
import { CallVideoGateway } from './video-call-gateway/video-call.gateway';
import { CompleteInfo } from './users/entities/CompleteInfo';
import { SendmessageModule } from './sendmessage/sendmessage.module';
import { Sendmessage } from './sendmessage/entities/sendmessage.entity';
import { DoctorAppointementModule } from './doctor-appointement/doctor-appointement.module';
import { DoctorAppointement } from './doctor-appointement/entities/doctor-appointement.entity';
@Module({
  imports: [ 
    
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'gt',
      entities: [User,connectedUserEntity,CompleteInfo,Sendmessage, DoctorAppointement , MessageEntity,JoinedRoomEntity,Room,LocalFile,Slider,Comments,Horaires,history,AnswerQuestion,subscriber,AgencyInfo,Interventions,blog,Contacts , Rdv  , Notification , Consultation  ,CheckupCategory , checkupoffers , Analysis , DemandeDoc , AnswerDoc  , Consultationfeedback , RetourClientAgency],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        UPLOADED_FILES_DESTINATION: Joi.string().required(),
       })
    }),
    
    ClientPageModule,
     ChatModule,
     UsersModule  , 

      DemandedocModule,
      ConsultationsModule,
      RdvModule,
      ClientContactModule,
      DocumentsModule,
      ChatbotModule,
      NotificationModule,
      CheckupModule,
      AnalysesModule,
      ConsultationfeedbackModule,
      RetourClientAgencyModule,
      SendmessageModule,
      DoctorAppointementModule  
    ],

  controllers: [AppController],
  providers: [AppService , CallVideoGateway],
  
})
  export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/apropos-page/history', method: RequestMethod.GET },
        { path: '/contact-blog/contact', method: RequestMethod.POST },
        { path: '/contact-blog/contact', method: RequestMethod.GET },
        { path: '/auth/refresh', method: RequestMethod.GET },
         { path: '/apropos-page/faq', method: RequestMethod.GET },
        { path: '/uploadedFiles/analyses/:filename', method: RequestMethod.GET },
        { path: '/uploadedFiles/consultation/:filename', method: RequestMethod.GET },
        { path: '/uploadedFiles/demandedoc/:filename', method: RequestMethod.GET },
        { path: '/uploadedFiles/rendezvousdocuments/:filename', method: RequestMethod.GET },

        { path: '/notification/reciever/:id', method: RequestMethod.GET },
        { path: '/uploadedFiles/retourpourlesclients/:filename', method: RequestMethod.GET },
        { path: '/uploadedFiles/avatar/:filename', method: RequestMethod.GET },
        { path: '/uploadedFiles/slider/:filename', method: RequestMethod.GET },
        { path: '/uploadedFiles/blog/:filename', method: RequestMethod.GET },
        { path: '/uploadedFiles/history-pic/:filename', method: RequestMethod.GET },
        { path: '/email-confirmation/confirm', method: RequestMethod.POST },
        { path: '/users', method: RequestMethod.POST },
        { path: '/users/search', method: RequestMethod.POST },
        { path: '/home/slider', method: RequestMethod.GET },
        { path: '/home/horraire', method: RequestMethod.GET },
        { path: '/home/commentaire', method: RequestMethod.GET },
        { path: '/contact-blog/blog', method: RequestMethod.GET }, 
        { path: '/services/qualities', method: RequestMethod.GET }, 
        { path: '/services/interventions', method: RequestMethod.GET }, 
        { path: '/apropos-page/subscriber', method: RequestMethod.POST }, 
        { path: '/local-files/:id', method: RequestMethod.GET },
        { path: '/local-files/:id', method: RequestMethod.GET },
        { path: '/users', method: RequestMethod.GET },
        { path: '/users/:id', method: RequestMethod.GET },
        { path: '/users/email/:email', method: RequestMethod.GET },
        { path: '/users/:id', method: RequestMethod.DELETE },
        { path: '/auth/login', method: RequestMethod.POST },
        { path: '/auth/register', method: RequestMethod.POST },
        { path: '/auth/logout', method: RequestMethod.POST },
        { path: '/reset/send', method: RequestMethod.POST },
        { path: '/reset/changepassword', method: RequestMethod.PATCH },
        { path: '/auth/facebook', method: RequestMethod.POST }, 
      )
      .forRoutes('');
  }
}
