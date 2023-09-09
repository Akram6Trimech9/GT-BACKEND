import LocalFile from "src/users/entities/localfile";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Analysis {
    @PrimaryGeneratedColumn("uuid")
    id:string ;
    @Column()
    analyseTitle: string 
    @Column()
    message : string 
    @ManyToMany(() => User  , User => User.analyses, { eager: true })
    @JoinTable() 
    sharedWith: User[];
    @OneToMany(()=> LocalFile , local => local.analyses , { eager: true  , cascade: true})  
    documents: LocalFile[]
}
