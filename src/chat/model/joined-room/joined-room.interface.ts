import { UserI } from "src/users/entities/user.interface"
import { RoomI } from "../room/room.interface"

export interface joinedRoomsI{

     id?: string 
    
     socketId:  string
    
     user : UserI

     room:RoomI

}