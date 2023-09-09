import { PartialType } from '@nestjs/swagger';
import { CreateRetourClientAgencyDto } from './create-retour-client-agency.dto';

export class UpdateRetourClientAgencyDto extends PartialType(CreateRetourClientAgencyDto) {}
