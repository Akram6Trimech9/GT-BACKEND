import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SendmessageService } from './sendmessage.service';
import { CreateSendmessageDto } from './dto/create-sendmessage.dto';
import { UpdateSendmessageDto } from './dto/update-sendmessage.dto';

@Controller('sendmessage')
export class SendmessageController {
  constructor(private readonly sendmessageService: SendmessageService) {}

  @Post()
  async  create(@Body() createSendmessageDto: any) {
    return await  this.sendmessageService.create(createSendmessageDto);
  }

  @Get()
   async  findAll() {
    return await  this.sendmessageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sendmessageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSendmessageDto: UpdateSendmessageDto) {
    return this.sendmessageService.update(+id, updateSendmessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sendmessageService.remove(id);
  }
}
