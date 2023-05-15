import LocalFile from "src/users/entities/localfile";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class history{
    
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    history_title : string  

    @Column()
    history_description : string 

    @OneToOne(() => LocalFile)
    @JoinColumn()
     history_picture: LocalFile 

}