import LocalFile from "src/users/entities/localfile";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum STATUS{
    WAITING ='waiting' , 
    ACCEPTED = 'accepted',
    REFUSED = 'refused'
}

@Entity()
export class Rdv {
    
@PrimaryGeneratedColumn("uuid")
id:string ;

@ManyToOne(() => User, user => user.rdv, { eager: true })
user: User;


@Column()
message : string ; 

@Column()
numTel: string ; 

@Column()
date : Date ; 

@Column()
addionalNote : String  ; 

@Column()
time : string


@Column({ default: STATUS.WAITING })
status: STATUS;

@OneToMany(()=> LocalFile , local => local.rdv , { eager: true})  
documents: LocalFile[];

}

