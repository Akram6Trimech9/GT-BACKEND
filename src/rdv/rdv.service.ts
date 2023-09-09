import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import LocalFile from 'src/users/entities/localfile';
import { User } from 'src/users/entities/user.entity';
import { MailService } from 'src/users/services/Mail.service';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { CreateRdvDto } from './dto/create-rdv.dto';
import { UpdateRdvDto } from './dto/update-rdv.dto';
import { Rdv, STATUS } from './entities/rdv.entity';
 
@Injectable()
export class RdvService {

  constructor(
    @InjectRepository(LocalFile)
    private readonly localFileRepository: Repository<LocalFile>,
     @InjectRepository(Rdv)
  private rdvRepository:Repository<Rdv> , 
  private  userSerice : UsersService , 
  
  private  mailService : MailService
  ){}
  
  async create(createRdvDto: CreateRdvDto , files : any): Promise<Rdv> {
    
    const rdv = this.rdvRepository.create(createRdvDto);
    rdv.user = createRdvDto.user;
    rdv.documents=files
    return this.rdvRepository.save(rdv);
  }
  async accept(id: string): Promise<Rdv> {
    await this.rdvRepository.update(id, { status: STATUS.ACCEPTED });
     const rdv = await this.rdvRepository.findOneBy({ id });
      
    if (!rdv) {
        throw new Error('Rendezvous not found.');
    }
     const user = await this.userSerice.findOne(rdv.user.id);
    if (!user) {
        throw new Error('User not found.'); 
    }
    await this.mailService.sendUserRdvAccept(user, rdv);
    return rdv; 
}


async saveFile(file: LocalFile): Promise<LocalFile> {    
  return await this.localFileRepository.save(file);
}
  async refuse(id: string): Promise<Rdv> {
    await this.rdvRepository.update(id, { status: STATUS.REFUSED });
    return  this.rdvRepository.findOneBy({id :id });
  }
  async allAcceptedRdv() : Promise<any>{ 
      return this.rdvRepository.find({ 
         where : { 
            status: STATUS.ACCEPTED
         } 
      })
  }

 
 async   findOne(id: string) : Promise<any> {
    return  await this.rdvRepository.findOneBy({id})
  }

  async findAll():Promise<any>{ 
      return await  this.rdvRepository.find({
         where:{
          status : STATUS.WAITING
         }
      })
  }
  update(id: number, updateRdvDto: UpdateRdvDto) {
    return `This action updates a #${id} rdv`;
  }

 async  remove(id: string) : Promise<any> {
    await   this.rdvRepository.delete({ 
       id 
    }) 
    return this.rdvRepository.find()
  }

}
