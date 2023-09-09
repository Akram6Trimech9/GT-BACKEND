import LocalFile from "src/users/entities/localfile";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class blog {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    title: string

    @Column()
    sub_title: string

    @Column('longtext')
     desciption: string
    
    @OneToOne(()=>LocalFile )
    @JoinColumn()
    image: LocalFile

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updatedAt: Date;
    
}