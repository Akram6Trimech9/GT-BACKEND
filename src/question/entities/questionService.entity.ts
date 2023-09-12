import LocalFile from "src/users/entities/localfile";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
 import { QuestionComment } from "./comment.entity";
import { Question } from "./question.entity";
@Entity()
export class QuestionCategory {
@PrimaryGeneratedColumn("uuid")
id:string ;

@Column()
service : string 

@Column()
icon : string
 
@OneToMany(()=> Question , Question =>Question.service)
questions: Question[]
 
}
