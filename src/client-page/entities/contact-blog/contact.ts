import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Contacts {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column()
    e_mail: string

    @Column()
    subject: string

    @Column()
    message: string


}