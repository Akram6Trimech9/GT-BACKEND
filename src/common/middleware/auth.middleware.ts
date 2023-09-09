import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthService } from 'src/users/services/auth.service';
  import { UsersService } from 'src/users/services/users.service';
   
export interface RequestModel extends Request {
  user: UserDto
}


@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private authService: AuthService, private userService: UsersService) { }

  async use(req: RequestModel, res: Response, next: NextFunction) {
    try {
      const tokenArray: string[] = req.headers['authorization'].split(' ');      
      const decodedToken = await this.authService.verifyJwt(tokenArray[1]);
      const id = decodedToken['sub'];
      const user: UserDto = await this.userService.findOne(id);
      if (user) {
        req.user = user;
        next();
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
