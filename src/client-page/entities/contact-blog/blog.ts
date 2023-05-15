import LocalFile from "src/users/entities/localfile";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class blog {
    @PrimaryGeneratedColumn("uuid")
    id: string

  

    @Column()
    title: string

    @Column()
    sub_title: string

    @Column()
    desciption: string
    
    @OneToOne(()=>LocalFile )
    @JoinColumn()
    image: LocalFile
}