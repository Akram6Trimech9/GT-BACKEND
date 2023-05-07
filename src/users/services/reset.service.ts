import { BadRequestException, Injectable } from "@nestjs/common";
import { changePasswordDto, ForgotPasswordDTO } from "../dto/forget-password.dto";
 import { MailService } from "./Mail.service";
import { UsersService } from "./users.service";
import * as bcrypt from 'bcrypt'
import { UpdateDto } from "../dto/update.dto";
import { AuthService } from "./auth.service";

@Injectable()
export  class ResetPasswordService{
    constructor( private userService : UsersService ,
           private authService : AuthService,
           private  mailService :MailService){ }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDTO): Promise<void> {

        const user = await this.userService.findByEmail(forgotPasswordDto.email);
        if (!user) {
            throw new BadRequestException('Invalid email');
        }
        const tokens = await this.authService.login(user);
      if(!tokens ){ 
         throw new BadRequestException('Invalid token');
      }
     
      await  this.mailService.forgotpass(user, tokens.accessToken)
     
     }

async changePassword( changeDto: changePasswordDto): Promise<boolean> { 
    const user = await this.userService.findByEmail(changeDto.email)
    const update = new UpdateDto()
    update.password = changeDto.password    
    await this.userService.update(user.id, update);
    return true;
}   
}