import { on } from "events";
import { history } from "src/client-page/entities/apropos-page/history.entity";
import { Slider } from "src/client-page/entities/client-page/slider";
import { blog } from "src/client-page/entities/contact-blog/blog";
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
  
  @OneToOne(()=>history , history=> history.history_picture)
  history_picture : history

  @OneToOne(()=>blog , blog=> blog.image)
  blog_picture : blog


}
 
export default LocalFile;