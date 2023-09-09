import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import LocalFile from 'src/users/entities/localfile';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { CreateRetourClientAgencyDto } from './dto/create-retour-client-agency.dto';
import { UpdateRetourClientAgencyDto } from './dto/update-retour-client-agency.dto';
import { RetourClientAgency } from './entities/retour-client-agency.entity';

@Injectable()
export class RetourClientAgencyService {
  constructor(
    @InjectRepository(LocalFile)
    private readonly localFileRepository: Repository<LocalFile>,
    @InjectRepository(RetourClientAgency)
    private retourRepo: Repository<RetourClientAgency>,
    private _userService: UsersService
  ) {}

  async create(data: any): Promise<any> {
    const retour = new RetourClientAgency();
    retour.title = data.title;
    retour.message = data.message;
    retour.doctor = await this._userService.findUSerByID(data.doctor);
    retour.clientId = await this._userService.findUSerByID(data.clientId);
    retour.documents= data.documents
    return await this.retourRepo.save(retour);
  }
  
  async saveFile(file: LocalFile): Promise<LocalFile> {
    return await this.localFileRepository.save(file);
  }

  async findAll() :Promise<any> {
    return   await this.retourRepo.find()
  }
  async findAllByDoctor(userId: string): Promise<RetourClientAgency[]> {
    return this.retourRepo.createQueryBuilder('retour')
      .innerJoinAndSelect('retour.doctor', 'doctor', 'doctor.id = :userId', { userId })
      .leftJoinAndSelect('retour.clientId', 'clientId')
      .leftJoinAndSelect('clientId.avatar', 'avatar')

      .leftJoinAndSelect('retour.documents', 'documents')
      .getMany();
  }


  findOne(id: number) {
    return `This action returns a #${id} retourClientAgency`;
  }

  update(id: number, updateRetourClientAgencyDto: UpdateRetourClientAgencyDto) {
    return `This action updates a #${id} retourClientAgency`;
  }

  async delete(id: string) {
    const retour = await this.retourRepo.findOne( {
       where :{ 
         id : id
       }
    });  
    const associatedFiles = retour.documents;

    for (let file of associatedFiles) {
        await this.localFileRepository.remove(file);  
    }

    return this.retourRepo.remove(retour);
}


}
