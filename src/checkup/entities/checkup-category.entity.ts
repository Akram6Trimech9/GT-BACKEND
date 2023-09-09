import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { checkupoffers } from "./checkkuparticles";

@Entity()
export class CheckupCategory {
    
    @PrimaryGeneratedColumn("uuid")
    id:string ;
    @Column({ default: '' }) 
    title: string 
    @Column({ default: '' })
    description : string 
    @OneToMany(() => checkupoffers, checkupoffers => checkupoffers.checkuCategory, { eager: true })
    checkupoffers:checkupoffers[]
   
}
