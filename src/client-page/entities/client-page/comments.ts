import { Max, Min } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comments{

    @PrimaryGeneratedColumn("uuid")
    id: string
    
    @Column()
    comment_desc : string 
  
    @Column()
    @Min(1, { message: "Rating must be between 1 and 5" })
    @Max(5, { message: "Rating must be between 1 and 5" })
    rating: number;

    @ManyToOne(()=>User , user =>user.comments)
    @JoinColumn()
    users : User

    
}