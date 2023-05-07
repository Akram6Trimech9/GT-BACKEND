
 import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "../room/room.entity";
import { v4 } from 'uuid';

@Entity()
export class JoinedRoomEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  socketId: string;

  @ManyToOne(() => User, user => user.joinedRooms)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Room, room => room.joinedUsers)
  @JoinColumn()
  room: Room;

}