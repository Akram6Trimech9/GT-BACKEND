import { PartialType } from '@nestjs/swagger';
import { CreateDoctorAppointementDto } from './create-doctor-appointement.dto';

export class UpdateDoctorAppointementDto extends PartialType(CreateDoctorAppointementDto) {}
