import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ForgotPasswordDTO{
    @IsNotEmpty()
    @IsEmail()
    email :string
}

export class changePasswordDto{
    
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string; 

    @IsString()
    @IsNotEmpty()
    readonly password: string;  

}