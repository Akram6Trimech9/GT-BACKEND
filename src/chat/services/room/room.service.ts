 import {   Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Room } from 'src/chat/model/room/room.entity';
import { RoomI } from 'src/chat/model/room/room.interface';
import { User } from 'src/users/entities/user.entity';
  import { UserI } from "src/users/entities/user.interface";
import { UsersService } from "src/users/services/users.service";
import { Repository } from "typeorm";
 


@Injectable()
export class RoomService {

    constructor(
        @InjectRepository(Room)
        private readonly roomRepository:  Repository<Room>,
        private _userService : UsersService 
    ){}

  
  async createRoom(room: RoomI, creator: User): Promise<RoomI> {        
      const newRoom = await this.addCreatorToRoom(room, creator);      
      return this.roomRepository.save(newRoom);
  }
  async getRoom(roomId: string): Promise<RoomI> {
    return this.roomRepository.findOneBy({id:roomId} )
  }
  async getRoomsForUser(userId: string): Promise<RoomI[]> {
    const rooms = await this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.users', 'user')
      .where('user.id = :userId', { userId })
      .leftJoinAndSelect('room.users', 'all_users')
      .getMany();      
    return rooms;
  }
    async addCreatorToRoom(room : RoomI, creator : User) : Promise<RoomI>{
        room.users.push(creator)        
        return   room
    }
}