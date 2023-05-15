import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Horaires {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    date_deb :Date  

    @Column()
    date_fin : Date 
    
    @Column()
    date_hours_deb : string 

    @Column()
    date_hours_fin : string

    @Column()
    weeknd_deb : Date

    @Column()
    weeknd_fin : Date
    
}
