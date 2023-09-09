import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientContactService } from './client-contact.service';
import { CreateClientContactDto } from './dto/create-client-contact.dto';
import { UpdateClientContactDto } from './dto/update-client-contact.dto';

@Controller('client-contact')
export class ClientContactController {
  constructor(private readonly clientContactService: ClientContactService) {}

  @Post()
  create(@Body() createClientContactDto: CreateClientContactDto) {
    return this.clientContactService.create(createClientContactDto);
  }

  @Get()
  findAll() {
    return this.clientContactService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientContactService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientContactDto: UpdateClientContactDto) {
    return this.clientContactService.update(+id, updateClientContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientContactService.remove(+id);
  }
}
