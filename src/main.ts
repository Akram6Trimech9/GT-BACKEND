import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressPeerServer } from 'peer';
import { AppModule } from './app.module';
 async function bootstrap() {
  
  const app = await NestFactory.create(AppModule,{
    bodyParser :true 
  });

async function ensureDatabaseDev(app:INestApplication){
 
 }
 app.setGlobalPrefix('api')

 
  const config = new DocumentBuilder()
  .setTitle('GT-HEALTH APIS')
  .setDescription('/* description */ ')
  .setVersion('1.0')
  .addTag('GT-HEALTH-API')
  .build();
const document = SwaggerModule.createDocument(app, config, {
  include: [],
  deepScanRoutes: true,
  ignoreGlobalPrefix: false, 
});
await ensureDatabaseDev(app);


SwaggerModule.setup('api', app, document, {
  swaggerOptions: {
    persistAuthorization: true,
  },
});
app.enableCors({origin : '*'}) ;
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);}
bootstrap();
