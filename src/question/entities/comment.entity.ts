 import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./question.entity";


@Entity()
export class QuestionComment {

@PrimaryGeneratedColumn("uuid")
id:string ;

@Column()
text : string 


// @OneToMany(()=> LocalFile , local =>local.question)
// documents: LocalFile[]

@ManyToOne(()=> User, user=> user.questionComment)
createdBy : User

@ManyToOne(()=> Question, Question=> Question.comments)
Question : Question


}
