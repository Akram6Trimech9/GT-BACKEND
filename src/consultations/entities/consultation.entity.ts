 import { Consultationfeedback } from 'src/consultationfeedback/entities/consultationfeedback.entity';
import LocalFile from 'src/users/entities/localfile';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, OneToOne } from 'typeorm';

@Entity()
export class Consultation {
  @PrimaryGeneratedColumn("uuid")
  id:string ;
   

  @Column()
  service: string;

  @Column()
  question: string;

  @Column({ type: 'text' })
  message: string;

  @OneToMany(()=> LocalFile , local => local.consultation , { eager: true})  
  documents: LocalFile[];

  @Column({ type: 'int' })
  taille: number;

  @Column({ type: 'int' })
  poid: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ default: '' })
  traitement: string;

  @Column()
  continueWithUs: string;

  @Column({ default: '' })
  antecedents: string;

  @ManyToOne(() => User, user => user.consultation, { eager: true })
  user: User;

  @ManyToMany(() => User , { eager: true })
  @JoinTable() 
  sharedWith: User[];

  @OneToMany(()=>Consultationfeedback , consultationfeedback =>  consultationfeedback.consultation  , { eager: true }  )
  feedback : Consultationfeedback[]
  
}
