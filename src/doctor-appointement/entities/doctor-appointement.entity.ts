import LocalFile from "src/users/entities/localfile";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class DoctorAppointement {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    tache : string 

    @Column({ type: 'datetime' })
    dateDeb : Date 

    @Column({ type: 'datetime' })    
    dateFin : Date  

    @Column()
    time : string 

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
    @Column()
    message : string
    @ManyToOne(() => User, User => User.DoctorAppointement, { eager: true, cascade: true })
    Doctor: User

    @OneToMany(() => LocalFile, local => local.DoctorAppointement, { eager: true, cascade: true })
    documents : LocalFile[]


}

