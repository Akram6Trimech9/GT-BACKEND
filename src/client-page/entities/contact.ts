import { Column, PrimaryGeneratedColumn } from "typeorm";

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