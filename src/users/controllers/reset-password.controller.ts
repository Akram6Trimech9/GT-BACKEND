import { Body, Controller, HttpCode, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AccessTokenGuard } from "src/common/guards/accessToken.guard";
import { changePasswordDto, ForgotPasswordDTO } from "../dto/forget-password.dto";
import { ResetPasswordService } from "../services/reset.service";

@Controller('reset')
export class ResetPasswordController{
    constructor(private resetService : ResetPasswordService) {
    }


    @Post('/send')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDTO): Promise<void> {
        return await this.resetService.forgotPassword(forgotPasswordDto);
    }

    // @UseGuards(AccessTokenGuard)
    @Patch('/changepassword')
    @HttpCode(200)
     async changePassword(@Body() changeDto: changePasswordDto ): Promise<boolean> {     
         return await  this.resetService.changePassword(changeDto);
    }


}
