import { BadRequestException, Injectable, NotFoundException, SetMetadata } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { User } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';
import { UpdateDto } from '../dto/update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import LocalFilesService from './localfile.service';



@Injectable()
export class UsersService {

  constructor(@InjectRepository(User)
  private userRepository: Repository<User>,
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
      relations :{
        avatar:true
      }
    })
    return user
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
  
  async searchUsers(searchString: string): Promise<User[]> {
    const users = await this.userRepository.find({relations :{
      avatar : true
    }});
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
    return await  this.userRepository.findOne({
      where: { id: userId },
      relations: ['avatar']
    });
  }

  async addAvatar(userId: string, fileData: LocalFileDto) {
     const avatarExist =await this.userRepository.findOneBy({id:userId})
      if(avatarExist.avatarId){ 
        throw new BadRequestException('icon already setted');
      }
    const avatar = await this.localFilesService.saveLocalFileData(fileData);
    await this.userRepository.update(userId, {
      avatarId: avatar.id
    })
  }

}
