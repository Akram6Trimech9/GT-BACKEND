import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Interventions {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    icon : string 
}