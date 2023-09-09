import { Module } from '@nestjs/common';
import { ClientContactService } from './client-contact.service';
import { ClientContactController } from './client-contact.controller';

@Module({
  controllers: [ClientContactController],
  providers: [ClientContactService]
})
export class ClientContactModule {}
