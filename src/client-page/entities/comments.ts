import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comments{

    @PrimaryGeneratedColumn("uuid")
    id: string
    
    @Column()
    comment_desc : string 

    @Column()
    rating : number 

    @ManyToOne(()=>User , user =>user.comments)
    @JoinColumn()
    users : User

    
}