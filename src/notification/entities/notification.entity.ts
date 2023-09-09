import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notification {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, user => user.sentNotifications  , {eager:true})
    sender: User;

    @ManyToOne(() => User, user => user.receivedNotifications ,{eager:true})
    receiver: User;

    @Column()
    message: string;
}
