import { Injectable } from '@nestjs/common';
import { CreateClientContactDto } from './dto/create-client-contact.dto';
import { UpdateClientContactDto } from './dto/update-client-contact.dto';

@Injectable()
export class ClientContactService {
  
  create(createClientContactDto: CreateClientContactDto) {
    return 'This action adds a new clientContact';
  }

  findAll() {
    return `This action returns all clientContact`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clientContact`;
  }

  update(id: number, updateClientContactDto: UpdateClientContactDto) {
    return `This action updates a #${id} clientContact`;
  }

  remove(id: number) {
    return `This action removes a #${id} clientContact`;
  }
}
