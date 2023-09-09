import LocalFile from "src/users/entities/localfile";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class RetourClientAgency {
@PrimaryGeneratedColumn("uuid")
id:string ;

@Column()
title : string  ; 

@Column()
message : string 

@ManyToOne(() => User , User => User.clientsretour , { eager: true }) 
clientId : User

@ManyToOne(()=> User, User => User.doctor  , { eager: true })
doctor : User 

@OneToMany(()=> LocalFile , local => local.retourClient , { eager: true  , cascade: ['remove']})  
documents: LocalFile[];


}