import { IsDate, isDate, IsNotEmpty, IsString } from "class-validator";
import { UserDto } from "src/users/dto/user.dto";

 
 export class changePasswordDto{

    id? : string  

    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsString()
    @IsNotEmpty()
    users:UserDto[] 

    @IsString()
    @IsNotEmpty()
    description?: string;

    @IsDate()
    createdAt?:Date  ;

    @IsDate()
    updatedAt?: Date ;
}