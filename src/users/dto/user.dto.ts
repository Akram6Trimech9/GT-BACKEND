import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import { Role } from "../enums/role"

 export class UserDto {
     id?:string

     @IsNotEmpty()
     @IsString()
     firstName:string 

     @IsNotEmpty()
     @IsString()
     lastName: string 

    //  @IsNotEmpty()
    //  @IsString()
  

     @IsEmail()
     email : string 

     @IsNotEmpty()
     password: string

     @IsNotEmpty()
     @IsString()
     country : string

     @IsNotEmpty()
     @IsString()
     address: string

     @IsNotEmpty()
     @IsString()
     role: Role

     isEmailConfirmed?:boolean

     refreshtoken? : string 
}
