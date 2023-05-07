 import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v4 } from 'uuid';
import { Room } from "../room/room.entity";

@Entity()
export class MessageEntity{
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  text: string;

  @ManyToOne(() => User, user => user.messages)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Room, room => room.messages)
  @JoinTable()
  room: Room;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
}