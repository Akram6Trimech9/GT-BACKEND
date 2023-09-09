import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Sendmessage {
    @PrimaryGeneratedColumn("uuid")
    id:string ;
    @Column()
    content:string ;
    @Column()
    otherDescription:string ; 
    @Column()
    purpose:string ;
    @ManyToOne(()=> User ,User=>User.sendedMessages )
    patient : User

}
