 import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
 import * as bcrypt from 'bcrypt'
import { User } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';
 import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
 import { Role } from '../enums/role';
import { MailService } from './Mail.service';
import { ConfirmEmailService } from './confirm.service';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepositoryMetadataArgs } from 'typeorm/metadata-args/EntityRepositoryMetadataArgs';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {

  constructor(@InjectRepository(User) 
              private userRepository: Repository<User>,
              private configService: ConfigService , 
              private jwtService: JwtService,
              private usersService : UsersService , 
               private emailService: MailService ,
               )  { }

  async register(userDto: UserDto) : Promise<any> {
    const userExists = await this.userRepository.findOneBy(
     { email : userDto.email}
    );
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const hash = await bcrypt.hash(userDto.password,12) ;
    const user = new User(userDto.firstName,userDto.lastName,userDto.email.toLowerCase(),userDto.country,userDto.address,hash,userDto.role,"")
    const newUser =  await this.userRepository.save(user)    
    const tokens = await this.getTokens(newUser.id, newUser.email ,newUser.role);
    await this.emailService.sendUserWelcome(user, tokens.accessToken);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return newUser ;
  }

  async loginWithFb(payload: any): Promise<any> {
    try {      
      const user = await this.userRepository.findOneBy({ email: payload.email});
      if (user) {
        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
      } else {        
        const hash = await bcrypt.hash(payload.password, 12);
        const user = new User(payload.firstName, payload.lastName,  payload.email.toLowerCase(), payload.country, payload.address, hash, payload.role, "");
        user.isEmailConfirmed = true;
        const newUser = await this.userRepository.save(user);
        const tokens = await this.getTokens(newUser.id, newUser.email, newUser.role);
        await this.updateRefreshToken(newUser.id, tokens.refreshToken);
        return tokens;
      }
    } catch (error) {
      console.error("Error logging in with Facebook:", error); // Add this line to see what the error is
      throw new InternalServerErrorException("Login with Facebook failed");
    }
  }
    

  async login( payload : any): Promise<any>{            
    const user = await this.userRepository.findOneBy({id:payload.id})
     if(!user.isEmailConfirmed){
       throw new BadRequestException('your email isn t confirmed yet ' )
     }
     const tokens = await this.getTokens(payload.id, payload.email.toLowerCase(),payload.role);
     await this.updateRefreshToken(payload.id, tokens.refreshToken);
     return tokens;
  }
  async logout(userId: string) {
    const newRefreshToken = this.generateRandomString(32);
    const hashedRefreshToken = await this.hashData(newRefreshToken);
    const user = await this.userRepository.findOneBy({id: userId});
    user.refreshToken = hashedRefreshToken;
    await this.userRepository.save(user);
    return { message: "User logged out successfully" };
  }
  
  hashData(data: string) {
     return bcrypt.hash(data , 12 );
  }

  async updateRefreshToken(userId: string, refreshToken: string) {

    const hashedRefreshToken = await this.hashData(refreshToken);

    const user = await this.userRepository.findOneBy({id:userId});
 
    user.refreshToken = hashedRefreshToken;

    await this.userRepository.save(user);
  }
  
  async getTokens(userId: string, email: string ,role :Role) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }


    generateRandomString(length: number): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
   }

   async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userRepository.findOneBy({id : userId});
    if (!user || !user.refreshToken){
      throw new ForbiddenException('Access Denied');
    } 
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email,user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async validateUser(email: string, pass: string): Promise<any> {     
    const user = await this.usersService.findByEmail(email);    
    if (user && (await this.passwordsAreEqual(user.password, pass))) {
      const { ...result } = user;

      return result;
    }
    return null;
  }

  private async passwordsAreEqual(
    hashedPassword: string,
    plainPassword: string
  ): Promise<boolean> {
   const passwordMatches= await bcrypt.compare(plainPassword, hashedPassword);
      if (!passwordMatches){
       throw new BadRequestException('Password is incorrect');
      }
      return passwordMatches
  }
  
  async verifyJwt(jwt: string): Promise<any> {
    if (!jwt) {
      throw new BadRequestException('JWT must be provided');
    }
    return this.jwtService.verifyAsync(jwt);
  }
   
  
 }
