import { on } from "events";
import { Slider } from "src/client-page/entities/slider";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

 
@Entity()
class LocalFile {
  @PrimaryGeneratedColumn("uuid")
  id: string
 
  @Column()
  filename: string;
 
  @Column()
  path: string;
 
  @Column()
  mimetype: string;
  
  @OneToOne(()=>User , user=> user.avatar)
  user:User
  
  @ManyToOne(()=> Slider , slider => slider.images)
  slider: Slider
  

}
 
export default LocalFile;