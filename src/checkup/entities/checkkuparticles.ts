import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CheckupCategory } from "./checkup-category.entity";

@Entity()
export class checkupoffers {
    
    @PrimaryGeneratedColumn("uuid")
    id:string ;
    @Column({ default: '' }) 
    title: string 
    @Column({ default: '' })
    description : string 
    @ManyToOne(()=>CheckupCategory ,CheckupCategory => CheckupCategory.checkupoffers)
    checkuCategory:CheckupCategory

}
