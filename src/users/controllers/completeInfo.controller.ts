import {
    Controller,
    ClassSerializerInterceptor,
    UseInterceptors,
    Post,
    Body,
    UseGuards,
    Req,
    HttpCode,
    Param,
    Patch,
    Get,
  } from '@nestjs/common';
import ConfirmEmailDto from '../dto/confirm.dto';
import { CompleteInfo } from '../entities/CompleteInfo';
import { CompleteInfoService } from '../services/completeInfo.service';
 import { ConfirmEmailService } from '../services/confirm.service';

   
  @Controller('subinfo')
   export class CompleteInfoController {
    constructor(
      private readonly completeInfoService: CompleteInfoService
    ) {}
   
    @Post('/:id')
    @HttpCode(202)
    async post( @Param('id') id :string ,  @Body() info: CompleteInfo) {       
        console.log("ok");
             
       return await   await this.completeInfoService.postInfo(info ,id );       

    }
    @Patch('/:id')
@HttpCode(204)
async update(@Param('id') id: string, @Body() updatedInfo: CompleteInfo) {
    return await this.completeInfoService.updateInfo(id, updatedInfo);
}

@Get('/:id')
async getOne(@Param('id') id: string): Promise<CompleteInfo> {
    return await this.completeInfoService.getByUserID(id);
}

}