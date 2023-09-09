import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import LocalFile from 'src/users/entities/localfile';
import { Repository } from 'typeorm';
import { CreateDoctorAppointementDto } from './dto/create-doctor-appointement.dto';
import { UpdateDoctorAppointementDto } from './dto/update-doctor-appointement.dto';
import { DoctorAppointement } from './entities/doctor-appointement.entity';

@Injectable()
export class DoctorAppointementService {
  constructor(
    @InjectRepository(LocalFile)
    private readonly localFileRepository: Repository<LocalFile>,
    
    @InjectRepository(DoctorAppointement)
    private readonly DoctorAppointementRepository: Repository<DoctorAppointement>,){}

    async  create(createDoctorAppointementDto: CreateDoctorAppointementDto) {
      const doctorAppointement =  await this.DoctorAppointementRepository.create(createDoctorAppointementDto)
      console.log(doctorAppointement);
      
        return  await this.DoctorAppointementRepository.save(doctorAppointement)
    }
 async  createWithDocs(createDoctorAppointementDto: CreateDoctorAppointementDto) {
  console.log("hey");
  
    const doctorAppointement =  await this.DoctorAppointementRepository.create(createDoctorAppointementDto)
      return  await this.DoctorAppointementRepository.save(doctorAppointement)
  }
  async saveFile(file: LocalFile): Promise<LocalFile> {    
    return await this.localFileRepository.save(file);
}

  async findAll() {
    return  await this.DoctorAppointementRepository.find()
  }
  async findTodayAppointment(id: string): Promise<DoctorAppointement[]> {
     const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
  
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
  
    const hey = await  this.DoctorAppointementRepository.createQueryBuilder("doctorappointement")
      .leftJoinAndSelect("doctorappointement.documents", "documents")
      .where("doctorappointement.dateDeb >= :startOfDay OR  (doctorappointement.dateFin >= :startOfDay AND  doctorappointement.dateFin <= :startOfDay)", { startOfDay: startOfDay })
      .andWhere("doctorappointement.Doctor.id = :id", { id: id })
      .leftJoinAndSelect("doctorappointement.Doctor","Doctor")
      .leftJoinAndSelect("Doctor.CompletedInfo","CompletedInfo")
      .leftJoinAndSelect("Doctor.avatar","avatar")
      .leftJoinAndSelect("Doctor.patients","patients")

      .getMany();
       return hey
      
  }
  
  

  findOne(id: number) {
    return `This action returns a #${id} doctorAppointement`;
  }

  update(id: number, updateDoctorAppointementDto: UpdateDoctorAppointementDto) {
    return `This action updates a #${id} doctorAppointement`;
  }

  async remove(id: string) {
    return  await  this.DoctorAppointementRepository.delete(id)
  }
}
