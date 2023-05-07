import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Intervensions {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    title: string

    @Column()
    description: string
}