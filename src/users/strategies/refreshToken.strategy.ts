import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token'
) {
  
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'labelebiRefresh',
        passReqToCallback: true,
        
    });
    }

  validate(req: Request, payload: any) {
    console.log("bonjour");
    
    if (!payload) {
        throw new UnauthorizedException('Invalid token payload.');
    }
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not found in the request.');
    }
    return {...payload, refreshToken};
}
}

