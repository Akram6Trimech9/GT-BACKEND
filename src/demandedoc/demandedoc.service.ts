import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import LocalFile from 'src/users/entities/localfile';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { AnswerDoc } from './entities/answerdemande.entity';
import { DemandeDoc } from './entities/demandedoc.entity';
 

@Injectable()
export class DemandedocService {
  constructor(
    @InjectRepository(LocalFile)
    private readonly localFileRepository: Repository<LocalFile>,
    @InjectRepository(DemandeDoc)
    private demandeRepo: Repository<DemandeDoc>,
    @InjectRepository(AnswerDoc)
    private answerRepo: Repository<AnswerDoc>,
    private _userService: UsersService
  ) {}

  async createAnswerForDemande(demandeId:string, data: Partial<AnswerDoc> , files : any ): Promise<AnswerDoc> {
    const demande = await this.demandeRepo.findOne({
      where: { 
        id : demandeId
      }
    });
     
    const answer = this.answerRepo.create(data);
    answer.demande = demande;
    answer.documents = files    
    return await this.answerRepo.save(answer);
  }
  

   async saveFile(file: LocalFile): Promise<LocalFile> {
    return await this.localFileRepository.save(file);
  }

  async findAll(): Promise<any> {
    return await this.demandeRepo.createQueryBuilder('demande')
      .leftJoinAndSelect('demande.answer', 'answer')
      .leftJoinAndSelect('answer.documents', 'documents') 
      .getMany();
  }
  
  async findAllBySharedWith(userId: string): Promise<DemandeDoc[]> {

    return this.demandeRepo.createQueryBuilder('demande-doc')
      .innerJoinAndSelect('demande-doc.sharedWith', 'user', 'user.id = :userId', { userId })
      .leftJoinAndSelect('demande-doc.answer', 'answer')
      .leftJoinAndSelect('answer.documents', 'documents') 
      .getMany();
  }
  
  async createDemande(data: Partial<DemandeDoc>): Promise<DemandeDoc> {
    const demandeDoc = this.demandeRepo.create(data);
    return await this.demandeRepo.save(demandeDoc);
  }
  async findAnswerByDemande(demandeId): Promise<any> { 
    return await this.answerRepo.createQueryBuilder('answer_doc')
      .innerJoinAndSelect('answer_doc.demande', 'demande', 'demande.id = :demandeId', { demandeId })
      // .innerJoinAndSelect('answer_doc.documents', 'documents')  // Added this line to fetch associated documents
      .getMany();
}

   async findOneDemande(id: string): Promise<DemandeDoc> {
    return await this.demandeRepo.findOne({ where:{
       id : id} ,
    relations: ["answer", "sharedWith"] 
  })
  }
   async deleteDemande(id: string): Promise<void> {
    await this.demandeRepo.delete(id);
  }

}
