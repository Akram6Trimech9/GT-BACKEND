import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./user.entity"

 

@Entity()
export class CompleteInfo {
  @PrimaryGeneratedColumn("uuid")
  id: string
  @Column()
  about: string
  @Column()
  formation : string 
  @Column()
  experience : string 
  @Column()
  hospital  : string 
  @Column()
  service : string 
  @OneToOne(() => User)
  @JoinColumn()
  doctor: User;
  
  
   
}