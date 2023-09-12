import LocalFile from "src/users/entities/localfile";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
 import { QuestionComment } from "./comment.entity";
import { QuestionCategory } from "./questionService.entity";
@Entity()
export class Question {
@PrimaryGeneratedColumn("uuid")
id:string ;

@Column()
question : string 

@ManyToOne(()=> QuestionCategory,Question =>Question.questions)
service : QuestionCategory 

@OneToMany(()=> LocalFile , local =>local.question)
documents: LocalFile[]

@ManyToOne(()=> User, user=> user.questions)
createdBy : User

@OneToMany(()=>  QuestionComment, questionComment => questionComment.Question)
comments :  QuestionComment[]

@ManyToOne(()=>User , fav => fav.favoritesPosts)
savedBy : User


@CreateDateColumn({ type: 'timestamp' })
createdAt: Date;

}
