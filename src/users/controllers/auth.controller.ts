import { Controller, Get, Post, Body, HttpCode, UseGuards, Request, Req, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import JwtRefreshGuard from 'src/common/guards/refreshToken.guard';
 import { UserDto } from '../dto/user.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }


  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(202)
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Post('register')
  @HttpCode(201)
  register(@Body() payload: UserDto) {
    return this.authService.register(payload);
  }
  @UseGuards(AccessTokenGuard)
  @Post('logout')
  @HttpCode(200)
  logout(@Req() req) {
    return this.authService.logout(req.user['sub']);
  }

  @UseGuards(AuthGuard('jwt-refresh-token'))
    @Get('refresh')
  refreshTokens(@Req() req) {
    console.log(req ,"req");
    
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('facebook')
  async loginFb(@Body() payload: any) {
    return await this.authService.loginWithFb(payload)
  }
  

}
