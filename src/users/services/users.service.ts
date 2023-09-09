import { BadRequestException, Injectable, NotFoundException, SetMetadata } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { User } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';
import { UpdateDto } from '../dto/update.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import LocalFilesService from './localfile.service';
import { Role } from '../enums/role';
import { async } from 'rxjs';



@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
  private userRepository: Repository<User>,
  @InjectEntityManager() private userManager: EntityManager,

    private localFilesService: LocalFilesService
  ) { }

  async register(createUserDto: UserDto) {
    const hashedPAssword = await bcrypt.hash(createUserDto.password, 22);
    const user = new User(createUserDto.firstName, createUserDto.lastName, createUserDto.email, createUserDto.country, createUserDto.address, hashedPAssword, createUserDto.role, '')
    await this.userRepository.save(user)
    return user;
  }

  async findAll(): Promise<UserDto[]> {
    const user = await this.userRepository.find({
      relations: {
        avatar: true
      }
    })
    return user
  }

  async findAlLPatients() : Promise<any[]>{
    return  await this.userManager.createQueryBuilder(User,'user')
    .where('user.role = :role', { role: Role.CLIENT })
    .getMany()
  }
  async findAllPatientsWithoutDoctors(): Promise<User[]> {
    return await this.userManager.createQueryBuilder(User, 'user')
      .where('user.doctor IS NULL AND user.role = :role', { role: Role.CLIENT })
      .leftJoinAndSelect('user.avatar', 'avatar')
      .getMany();
  }
  
  async findPatientsByDoctor(idDoctor : string ) : Promise<any>{     
       return await this.userManager.createQueryBuilder(User , 'user')
       .leftJoinAndSelect('user.doctor', 'doctor')
        .where('doctor.id = :iddoctor',{iddoctor : idDoctor})
        .leftJoinAndSelect('user.avatar', 'avatar')
        .getMany()
  }
  async findAllDoctors(): Promise<User[]> {
    return await this.userManager.createQueryBuilder(User, 'user')
      .where('user.role = :role', { role: Role.MEDECIN })
      .leftJoinAndSelect('user.avatar', 'avatar')
      .leftJoinAndSelect('user.patients', 'patients')
      .leftJoinAndSelect('patients.avatar', 'patientAvatar')
      .getMany();
}


  async findOne(id: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['avatar']
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async findByEmail(email: string): Promise<UserDto | undefined> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['avatar']
    });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    return user;
  }

  async getDoctor(id: string): Promise<any> {
    return await this.userRepository.createQueryBuilder("user")
        .where("user.id = :id", { id })
        .leftJoinAndSelect("user.patients","patients")
         .getOne();
}

 async deletePatientFromDoctorList(patientId: string, doctorId: string): Promise<any> {
  let doctor = await this.getDoctor(doctorId); 
  if (!doctor) {
      throw new NotFoundException('Doctor not found');
  }
  if (!doctor.patients) {
      throw new BadRequestException('Doctor has no patients');
  }
   doctor.patients = doctor.patients.filter(patient => patient.id !== patientId);  
   await this.userRepository.save(doctor);
  return doctor;
}

  async update(id: string, updateUserDto: UpdateDto): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['avatar']
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.firstName = updateUserDto.firstName ?? user.firstName;
    user.lastName = updateUserDto.lastName ?? user.lastName;
    user.email = updateUserDto.email ?? user.email;
    user.country = updateUserDto.country ?? user.country;
    user.address = updateUserDto.address ?? user.address;
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 12);
      user.password = hashedPassword;
    }
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }



  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id: id })
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.userRepository.remove(user);
    return 'user deleted'
  }

  async getOne(id: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['avatar']
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAdmin(): Promise<User | undefined> {
    const admin = await this.userRepository.findOne({
      where: { role: Role.ADMIN }
    });
    if (!admin) {
      throw new NotFoundException('Admin user not found');
    }
    return admin;
  }

  async searchUsers(searchString: string): Promise<User[]> {
    const users = await this.userRepository.find({
      relations: {
        avatar: true
      }
    });
    const filteredUsers = users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (
        user.firstName.toLowerCase().includes(searchString) ||
        user.lastName.toLowerCase().includes(searchString) ||
        user.email.toLowerCase().includes(searchString) ||
        fullName.toLowerCase().includes(searchString)
      );
    });
    return filteredUsers;
  }
  async searchDoctors(searchString: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: {
        role: Role.MEDECIN
      },
    });
    const filteredUsers = users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (
        user.firstName.toLowerCase().includes(searchString) ||
        user.lastName.toLowerCase().includes(searchString) ||
        user.email.toLowerCase().includes(searchString) ||
        fullName.toLowerCase().includes(searchString)
      );
    });
    return filteredUsers;
  }



  async findOneUser(userId: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['avatar']
    });
  }
  async findUSerByID(userId: string): Promise<any> {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['avatar']
    });
  }


  async addAvatar(userId: string, fileData: LocalFileDto) {
    const avatarExist = await this.userRepository.findOneBy({ id: userId })
    if (avatarExist.avatarId) {
      throw new BadRequestException('icon already setted');
    }
    const avatar = await this.localFilesService.saveLocalFileData(fileData);
    await this.userRepository.update(userId, {
      avatarId: avatar.id
    })
  }
  async addPatientToDoctor(doctorId: string, patientId: string): Promise<any> {
    const doctor = await this.userRepository.findOne({
        where: {
            id: doctorId
        },
        relations: ['patients']
    });

    if (!doctor) {
        throw new Error('Doctor not found');
    }

    const patient = await this.userRepository.findOne({
        where: {
            id: patientId
        }
    });

    if (!patient) {
        throw new Error('Patient not found');
    }

    if (patient.doctor) {
        throw new Error('Patient already has an associated doctor');
    }

    doctor.patients.push(patient);
    patient.doctor = doctor;
    await this.userRepository.save(patient);
    await this.userRepository.save(doctor);
    return  true
}

async addDoctorToPatient(patientId: string, doctorId: string): Promise<void> {
    const patient = await this.userRepository.findOne({
        where: {
            id: patientId
        },
        relations: ['doctor']
    });

    if (!patient) {
        throw new Error('Patient not found');
    }

    const doctor = await this.userRepository.findOne({
        where: {
            id: doctorId
        }
    });

    if (!doctor) {
        throw new Error('Doctor not found');
    }

    if (patient.doctor) {
        throw new Error('Patient already has an associated doctor');
    }

    patient.doctor = doctor;
    await this.userRepository.save(patient);
}

}


