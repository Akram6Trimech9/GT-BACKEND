import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
 import { UsersController } from './controllers/users.controller';
import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
 import { AccessTokenStrategy } from './strategies/accessToken.strategy';
 import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { RolesGuard } from 'src/common/guards/RolesGuard';
import  {MailerModule} from '@nestjs-modules/mailer'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
 import { join } from 'path';
import { MailService } from './services/Mail.service';
 import { EmailConfirmationController } from './controllers/confirm.controller';
import { ResetPasswordService } from './services/reset.service';
import { ConfirmEmailService } from './services/confirm.service';
import { ResetPasswordController } from './controllers/reset-password.controller';
import JwtRefreshGuard  from 'src/common/guards/refreshToken.guard';
import { ConfigService } from '@nestjs/config';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { ChatModule } from 'src/chat/chat.module';
import { AuthService } from './services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import LocalFilesService from './services/localfile.service';
import LocalFilesInterceptor from 'src/common/interceptor/localfile.interceptor';
import LocalFile from './entities/localfile';
import LocalFilesController from './controllers/LocalFilesController';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { LocalAuthGuard } from 'src/common/guards/local.guard';
import { CompleteInfo } from './entities/CompleteInfo';
import { JwtRefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { CompleteInfoService } from './services/completeInfo.service';
import { CompleteInfoController } from './controllers/completeInfo.controller';
@Module({

  imports :[   
    TypeOrmModule.forFeature([User,LocalFile , CompleteInfo]),

    
    PassportModule.register({
      defaultStrategy: 'jwt',
     }),
     JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService]
    }),
    
    MailerModule.forRoot({
      transport: {
        host:"smtp-relay.sendinblue.com" ,
        port:587,
        auth: {
          user:"web-admin@gt-health.tn",
          pass:"xsmtpsib-84136c5035b5b5ff7e2c442737413788ecd7702504df30cba3f0a4d3cb9ec7e1-gABQEC5ZPNmazw8s"
        }
      },
      defaults: {
        from: `"GT HEALTH" <web-admin@gt-health.tn>`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        },
      }
    }),
 
  ],
  controllers: [UsersController,AuthController,ResetPasswordController,EmailConfirmationController,    CompleteInfoController,
    LocalFilesController],
  providers: [
    JwtRefreshTokenStrategy ,
    UsersService, 
    AuthService,
    ResetPasswordService,
    ConfirmEmailService,
    LocalFilesService,
     MailService,
     JwtRefreshGuard,
     AccessTokenStrategy, 
      RolesGuard,
      LocalStrategy,
     AccessTokenGuard,
     CompleteInfoService,
     LocalAuthGuard,
     ]
    ,exports:[
      AuthService,
      UsersService,
      MailService
     ]

})
export class UsersModule{}

