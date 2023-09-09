import { BadRequestException, Injectable, NotFoundException, SetMetadata } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { User } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';
import { UpdateDto } from '../dto/update.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import LocalFilesService from './localfile.service';
import { Role } from '../enums/role';
import { CompleteInfo } from '../entities/CompleteInfo';
import { UsersService } from './users.service';



@Injectable()
export class CompleteInfoService {

  constructor(
    @InjectRepository(CompleteInfo)
  private completeInfoRepository: Repository<CompleteInfo>,
  @InjectEntityManager() private userManager: EntityManager,
    private localFilesService: LocalFilesService , 
    private  userService :UsersService
  ) { }

  async postInfo(info: CompleteInfo, id: string) {
    const user = await this.userService.findOneUser(id);
    
    if(!user) {
        throw new NotFoundException('User not found');
    }
    
    const completeInfo = new CompleteInfo();
    completeInfo.about = info.about;
    completeInfo.formation = info.formation;
    completeInfo.experience = info.experience;
    completeInfo.hospital = info.hospital;
    completeInfo.service = info.service;
    completeInfo.doctor = user;

    return await this.completeInfoRepository.save(completeInfo);}

    async updateInfo(id: string, updatedInfo: CompleteInfo): Promise<CompleteInfo> {
        const completeInfo = await this.completeInfoRepository.findOne({
            where: { 
                 id : id 
            }
        });
    
        if (!completeInfo) {
            throw new NotFoundException('Complete info not found');
        }
    
        Object.assign(completeInfo, updatedInfo);
    
        return await this.completeInfoRepository.save(completeInfo);
    }

    async getByUserID(id: string): Promise<CompleteInfo> {
        const completeInfo = await this.completeInfoRepository
            .createQueryBuilder('complete')
            .leftJoinAndSelect('complete.doctor', 'doctor')
            .where('doctor.id = :doctorID', { doctorID: id })
            .getOne();
    
        if (!completeInfo) {
            throw new NotFoundException('Complete info not found');
        }
    
        return completeInfo;
    }
    

    
}


