import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class blog {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    image: string

    @Column()
    title: string

    @Column()
    sub_title: string

    @Column()
    desciption: string
}