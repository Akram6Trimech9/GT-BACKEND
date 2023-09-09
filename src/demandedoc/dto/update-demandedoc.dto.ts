import { PartialType } from '@nestjs/mapped-types';
import { CreateDemandedocDto } from './create-demandedoc.dto';

export class UpdateDemandedocDto extends PartialType(CreateDemandedocDto) {}
