import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { doc } from 'prettier';
import { ConsultationService } from 'src/consultations/consultations.service';
import { UsersService } from 'src/users/services/users.service';
import { EntityManager, Repository } from 'typeorm';
import { CreateConsultationfeedbackDto } from './dto/create-consultationfeedback.dto';
import { UpdateConsultationfeedbackDto } from './dto/update-consultationfeedback.dto';
import { Consultationfeedback } from './entities/consultationfeedback.entity';

@Injectable()
export class ConsultationfeedbackService {
        constructor( 
           @InjectRepository(Consultationfeedback)
        private consultationRepository: Repository<Consultationfeedback> ,
         private userService  : UsersService ,
         private consultationService :ConsultationService ,
         @InjectEntityManager() private ConsultationManager: EntityManager,


        ){

        }
    async create(createConsultationfeedbackDto: CreateConsultationfeedbackDto): Promise<Consultationfeedback> {
    try {
 
      const doctor = await this.userService.findOneUser(createConsultationfeedbackDto.doctor.id);
      if (!doctor) {
        throw new Error('Doctor not found.');
      }
      
      const consultation = await this.consultationService.getConsultationByid(createConsultationfeedbackDto.consultation.id);
      if (!consultation) {
        throw new Error('Consultation not found.');
      }
      
      const consultationfeedback = new Consultationfeedback();
      consultationfeedback.doctor = doctor;
      consultationfeedback.message = createConsultationfeedbackDto.message;
      consultationfeedback.consultation = consultation;
     
      return await this.consultationRepository.save(consultationfeedback);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll() : Promise<Consultationfeedback[]> {
       return this.consultationRepository.createQueryBuilder('consultationfeedback')
       .leftJoinAndSelect('consultationfeedback.consultation', 'consultation')   
          .leftJoinAndSelect('consultationfeedback.doctor', 'doctor')   
          .leftJoinAndSelect('doctor.avatar','avatar')
           .getMany();
      }
  

  findOne(id: number) {
    return `This action returns a #${id} consultationfeedback`;
  }

  update(id: number, updateConsultationfeedbackDto: UpdateConsultationfeedbackDto) {
    return `This action updates a #${id} consultationfeedback`;
  }

  async  remove(id: string) {
    return  await this.consultationRepository.delete(id)
  }
}
 