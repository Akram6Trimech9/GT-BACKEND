import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import LocalFile from 'src/users/entities/localfile';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { EntityManager, Repository } from 'typeorm';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { Consultation } from './entities/consultation.entity';
@Injectable()
export class ConsultationService {
  constructor(

    @InjectRepository(LocalFile)
    private readonly localFileRepository: Repository<LocalFile>,
    @InjectRepository(Consultation)
    private consultationRepository: Repository<Consultation>,
    private _userService:  UsersService ,
    @InjectEntityManager() private ConsultationManager: EntityManager,

  ) {}

  async create(data: Partial<any>): Promise<Consultation> {
    const user =   await this._userService.findOneUser(data.userid)    
    const consultation = this.consultationRepository.create(data);
    consultation.user=user
    return await this.consultationRepository.save(consultation);
  }

  async saveFile(file: LocalFile): Promise<LocalFile> {    
    return await this.localFileRepository.save(file);
}
async getConsultationsSharedWithUser(userId: string): Promise<Consultation[]> {
  return this.consultationRepository.createQueryBuilder('consultation')
      .leftJoinAndSelect('consultation.sharedWith', 'user')   
      .where('user.id = :userId', { userId })    
      .leftJoinAndSelect('consultation.documents', 'documents')  
      .leftJoinAndSelect('consultation.feedback', 'feedback')   
      .leftJoinAndSelect('feedback.doctor', 'doctor')   
      .leftJoinAndSelect('feedback.consultation', 'associatedConsultation') 
      .getMany();
}

async getConsultations():Promise<any>{ 
   return await this.consultationRepository.find()
}


async getConsultationByClient(iduser: string): Promise<any> { 
  return await this.ConsultationManager.createQueryBuilder(Consultation , 'consultation')
  .leftJoinAndSelect('consultation.user', 'user')
   .where('user.id = :userId',{userId : iduser})
   .leftJoinAndSelect('consultation.sharedWith', 'sharedWith')
   .leftJoinAndSelect('consultation.documents', 'documents')

    .getMany()
}



async remove(id :string) : Promise<any>{
  const  consultation = await this.consultationRepository.findOneBy({id})
 consultation.documents.forEach(async element => {  
      await this.localFileRepository.remove(element)
 });
  return await this.consultationRepository.delete({id})
}

async shareConsultationWithUsers(consultationId: string, userIds: any[]): Promise<Consultation> {
 
  const consultation = await this.consultationRepository.findOne({
    where: { id: consultationId },
    relations: ["sharedWith"]
  });

  if (!consultation) {
    throw new NotFoundException('Consultation not found');
  }

  if (!consultation.sharedWith) {
    consultation.sharedWith = [];
  }

  const users: User[] = [];
  for (const itemId of userIds) {
    const user = await this._userService.findOneUser(itemId);
    if (user) users.push(user);
  }
  consultation.sharedWith.push(...users);
  
  return await this.consultationRepository.save(consultation);
}

async getConsultationByid(id : string ) : Promise<any>{ 
  return await this.ConsultationManager.createQueryBuilder(Consultation , 'consultation')
    .where('consultation.id = :id',{id : id})
    .getOne()
}

}
