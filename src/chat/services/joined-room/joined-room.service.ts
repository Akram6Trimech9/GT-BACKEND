 import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JoinedRoomEntity } from "src/chat/model/joined-room/joined-room.entity";
import { joinedRoomsI } from "src/chat/model/joined-room/joined-room.interface";
import { RoomI } from "src/chat/model/room/room.interface";
import { UserI } from "src/users/entities/user.interface";
import { Repository } from "typeorm";


@Injectable()
export class JoinedRoomService{ 

    constructor(
        @InjectRepository(JoinedRoomEntity)
        private readonly joinedRepository:  Repository<JoinedRoomEntity>,
     ){}

    async create(joinedRoom :  joinedRoomsI) : Promise<joinedRoomsI>{
           return await this.joinedRepository.save(joinedRoom)
    }

    async findByUser(user : UserI) : Promise<joinedRoomsI[]>{
        return this.joinedRepository.findBy({user})

    }

    async findByRoom(room : RoomI) : Promise<joinedRoomsI[]>{
        const query = await this.joinedRepository
        .createQueryBuilder('joined_room_entity')
        .leftJoin('joined_room_entity.room', 'room')
        .where('room.id = :roomId', { roomId: room.id })
        .getMany()   
          return query 
    }

    async deleteBySocketId(socketId:string){
       return this.joinedRepository.delete({socketId})     
    }

    async deleteAll(){
        await this.joinedRepository.createQueryBuilder().delete().execute()
    }
}