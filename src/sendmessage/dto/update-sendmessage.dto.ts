import { PartialType } from '@nestjs/mapped-types';
import { CreateSendmessageDto } from './create-sendmessage.dto';

export class UpdateSendmessageDto extends PartialType(CreateSendmessageDto) {}
