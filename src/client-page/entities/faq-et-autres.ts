import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AnswerQuestion {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    question: string

    @Column()
    answer: string

}