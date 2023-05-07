import {
    Controller,
    ClassSerializerInterceptor,
    UseInterceptors,
    Post,
    Body,
    UseGuards,
    Req,
    HttpCode,
  } from '@nestjs/common';
import ConfirmEmailDto from '../dto/confirm.dto';
 import { ConfirmEmailService } from '../services/confirm.service';

   
  @Controller('email-confirmation')
  @UseInterceptors(ClassSerializerInterceptor)
  export class EmailConfirmationController {
    constructor(
      private readonly emailConfirmationService: ConfirmEmailService
    ) {}
   
    @Post('confirm')
    @HttpCode(202)
    async confirm(@Body() confirmationData: ConfirmEmailDto) {            
       const email = await this.emailConfirmationService.decodeConfirmationToken(confirmationData.token);       
      return await this.emailConfirmationService.confirmEmail(email);

    }

}