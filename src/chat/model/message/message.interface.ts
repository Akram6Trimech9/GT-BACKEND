import { UserI } from "src/users/entities/user.interface"
import { RoomI } from "../room/room.interface"

export interface messageI{
    id: string 
    text : string 
    user : UserI
    room : RoomI
    createdAt : Date  ; 
    updatedAt : Date ;
}