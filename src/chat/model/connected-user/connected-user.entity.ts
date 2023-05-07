 import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { v4 } from 'uuid';

@Entity()
export class connectedUserEntity{
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  socketId: string;

  @ManyToOne(() => User, user => user.connections)
  @JoinColumn()
  user: User;

}