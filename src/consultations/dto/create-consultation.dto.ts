// create-consultation.dto.ts
import { IsString, IsNotEmpty, IsInt, IsOptional, IsBoolean } from 'class-validator';
import LocalFile from 'src/users/entities/localfile';

export class CreateConsultationDto {
  
  @IsNotEmpty()
  @IsString()
  service: string;

  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  documents:LocalFile[]
  
  @IsNotEmpty()
  @IsInt()
  taille: number;

  @IsNotEmpty()
  @IsInt()
  poid: number;

  @IsOptional()
  @IsString()
  traitement: string;

  @IsNotEmpty()
   continueWithUs: string;

  @IsOptional()
  @IsString()
  antecedents: string;
}
