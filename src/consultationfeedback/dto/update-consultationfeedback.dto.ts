import { PartialType } from '@nestjs/swagger';
import { CreateConsultationfeedbackDto } from './create-consultationfeedback.dto';

export class UpdateConsultationfeedbackDto extends PartialType(CreateConsultationfeedbackDto) {}
