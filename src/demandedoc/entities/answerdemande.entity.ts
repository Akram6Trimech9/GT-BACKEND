import LocalFile from "src/users/entities/localfile";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DemandeDoc } from "./demandedoc.entity";

@Entity()
export class AnswerDoc {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({default:''})
    message: string
    @ManyToOne(() => DemandeDoc, DemandeDoc => DemandeDoc.answer)
    demande: DemandeDoc;
    @OneToMany(() => LocalFile, local => local.answerDoc, { eager: true, cascade: true })
    documents: LocalFile[]
}
