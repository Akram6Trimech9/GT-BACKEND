import LocalFile from "src/users/entities/localfile";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AnswerDoc } from "./answerdemande.entity";

@Entity()
export class DemandeDoc {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    title: string
    @Column()
    message: string
    @ManyToOne(() => User, User => User.demands, { eager: true })
    @JoinTable()
    sharedWith: User;
    @OneToOne(() => AnswerDoc, AnswerDoc => AnswerDoc.demande, { eager: true })
    @JoinTable()

    answer: AnswerDoc

    
}
