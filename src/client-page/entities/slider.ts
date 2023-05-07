import LocalFile from "src/users/entities/localfile";
import { Column, Entity, JoinColumn, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Slider {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @OneToMany(() => LocalFile, files => files.slider )
    images: LocalFile[];
    

    @Column()
    title: string

    @Column()
    description: string

}