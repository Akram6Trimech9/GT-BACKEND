
 import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { JoinedRoomEntity } from "../joined-room/joined-room.entity";
import { MessageEntity } from "../message/message.entity";
import { v4 } from 'uuid';

@Entity()
export class Room {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string;

  @Column({nullable: true})
  description: string;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToMany(() => JoinedRoomEntity, joinedRoom => joinedRoom.room)
  joinedUsers: JoinedRoomEntity[];

  @OneToMany(() => MessageEntity, message => message.room)
  messages: MessageEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}