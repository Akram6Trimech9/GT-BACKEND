import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { CreateSendmessageDto } from './dto/create-sendmessage.dto';
import { UpdateSendmessageDto } from './dto/update-sendmessage.dto';
import { Sendmessage } from './entities/sendmessage.entity';

@Injectable()
export class SendmessageService {
  constructor(
 
    @InjectRepository(Sendmessage)
    private _sendmessageRepository: Repository<Sendmessage>,
    private _userService: UsersService
  ) {}
  async create(createSendmessageDto: any) : Promise<any> {
    const message   : any  = await this._sendmessageRepository.create(createSendmessageDto)
 message.patient     = createSendmessageDto.user
 console.log(message);
 
    return   await this._sendmessageRepository.save(message)
  }

  async findAll() :Promise<any[]> {
    return  await this._sendmessageRepository.createQueryBuilder('message')
    .leftJoinAndSelect('message.patient' , 'patient')
    .getMany()
  }

  findOne(id: number) {
    return `This action returns a #${id} sendmessage`;
  }

  update(id: number, updateSendmessageDto: UpdateSendmessageDto) {
    return `This action updates a #${id} sendmessage`;
  }

  async remove(id: string) {
    return await this._sendmessageRepository.delete(id)

  }
}
