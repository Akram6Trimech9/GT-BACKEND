import { UserI } from "src/users/entities/user.interface";

export interface ConnectedUserI{
    id? : string; 
    socketId: string ;
    user : UserI
}