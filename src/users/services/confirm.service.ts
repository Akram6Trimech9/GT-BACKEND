 import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './Mail.service';
import { AuthService } from './auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
 
@Injectable()
export class ConfirmEmailService {
  constructor(
     @InjectRepository(User)
    private usersRepository: Repository<User>,
    private userService: UsersService,
    private jwtService: JwtService,
    private authService: AuthService,
    private emailService: MailService
  ) { }


  async confirmEmail(email: string) :Promise<any>{
    const user = await this.usersRepository.findOneBy({email: email });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    user.isEmailConfirmed = true;

    await this.usersRepository.save(user);
    
    return this.authService.login(user)
  }


  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  public async resendConfirmationLink(userId: string, token: string) {

    const user = await this.userService.findOne(userId);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.emailService.sendUserWelcome(user.email, token);

  }



}