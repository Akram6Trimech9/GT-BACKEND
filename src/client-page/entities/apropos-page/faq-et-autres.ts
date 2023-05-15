import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AnswerQuestion {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    question: string

    @Column()
    answer_title : string 

    @Column({nullable:true})
    answer_one_desc : string 

    @Column()
    answer_title_two : string 

    @Column({nullable:true})
    answer_two_desc : string 
 
}