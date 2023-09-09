import { Consultation } from "src/consultations/entities/consultation.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Consultationfeedback {

    @PrimaryGeneratedColumn("uuid")
    id:string ;
     
    @Column()
    message: string;
 
    @ManyToOne(() => User , User => User.consultationfeedbacks )
    doctor : User 

    @ManyToOne(() => Consultation , Consultation => Consultation.feedback )
    consultation : Consultation

}
