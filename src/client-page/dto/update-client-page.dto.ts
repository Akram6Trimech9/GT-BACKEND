import { PartialType } from '@nestjs/swagger';
import { CreateClientPageDto } from './create-client-page.dto';

export class UpdateClientPageDto extends PartialType(CreateClientPageDto) {}
