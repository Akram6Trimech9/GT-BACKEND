import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import * as jwt from 'jsonwebtoken';
 

export  interface JwtPayload {
    sub: string
    email:string 
    role: string
    iat: string
    exp: string
}
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]);    
    if (!roles) {
      return false;
    }
    try {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader.slice(7, authHeader.length);
    const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET)       
     const  userRole = decoded.role
    return this.validateRoles(roles, [userRole]);
    }catch (error) {
        throw  new UnauthorizedException();
      }
  }

  validateRoles(roles: string[], userRoles: string[]) {
    return roles.some(role => userRoles.includes(role));
  }
}
