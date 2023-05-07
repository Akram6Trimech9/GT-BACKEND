import { connectedUserEntity } from "src/chat/model/connected-user/connected-user.entity";
import { JoinedRoomEntity } from "src/chat/model/joined-room/joined-room.entity";
import { MessageEntity } from "src/chat/model/message/message.entity";
import { Room } from "src/chat/model/room/room.entity";
import { Comments } from "src/client-page/entities/peopele-comments";
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../enums/role";
import LocalFile from "./localfile";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string
  @Column()
  firstName: string

  @Column()
  lastName: string


  @JoinColumn({ name: 'avatarId' })
  @OneToOne(
    () => LocalFile,
    {
      nullable: true
    }
  )
  public avatar?: LocalFile;

  @Column({ nullable: true })
  public avatarId?: string;

 
  @Column()
  email: string

  @Column()
  country: string

  @Column()
  password: string

  @Column()
  address: string

  @Column()
  refreshToken: string;

  @Column()
  role: Role

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @OneToMany(() => connectedUserEntity, connection => connection.user)
  connections: connectedUserEntity[];

  @OneToMany(() => JoinedRoomEntity, joinedRoom => joinedRoom.user)
  joinedRooms: JoinedRoomEntity[];

  @OneToMany(() => MessageEntity, message => message.user)
  messages: MessageEntity[];


  // @ManyToOne()  
  // room:RoomEntity
  // inverse side has to point to the owning side via `mappedBy` attribute/parameter
  @ManyToMany(() => Room, room => room.users)
  rooms: Room[];

  @OneToMany(() => Comments, comment => comment.users)
  comments: Comments[]

  constructor(firstName: string, lastName: string, email: string, country: string, address: string, password: string, role: Role, refreshtoken: string) {

    this.firstName = firstName;
    this.lastName = lastName;
     this.email = email;
    this.address = address
    this.country = country
    this.password = password
    this.role = role
    this.refreshToken = refreshtoken

  }

}

