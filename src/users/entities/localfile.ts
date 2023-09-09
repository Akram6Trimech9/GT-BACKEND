import { on } from "events";
import { Analysis } from "src/analyses/entities/analysis.entity";
import { history } from "src/client-page/entities/apropos-page/history.entity";
import { Slider } from "src/client-page/entities/client-page/slider";
import { blog } from "src/client-page/entities/contact-blog/blog";
import { Consultation } from "src/consultations/entities/consultation.entity";
import { AnswerDoc } from "src/demandedoc/entities/answerdemande.entity";
import { DemandeDoc } from "src/demandedoc/entities/demandedoc.entity";
import { DoctorAppointement } from "src/doctor-appointement/entities/doctor-appointement.entity";
import { Rdv } from "src/rdv/entities/rdv.entity";
import { RetourClientAgency } from "src/retour-client-agency/entities/retour-client-agency.entity";
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
 
  @ManyToOne(()=>Consultation , consultation=> consultation.documents)
  consultation: Consultation
  
  @ManyToOne(()=>Rdv , Rdv=> Rdv.documents)
  rdv : Rdv
  @ManyToOne(() => AnswerDoc, answerDoc => answerDoc.documents)
  answerDoc: AnswerDoc;

  @ManyToOne(()=>Analysis , Analysis=> Analysis.documents)
  analyses: Analysis

  @ManyToOne(()=>RetourClientAgency , retour=> retour.documents)
   retourClient : RetourClientAgency

   @ManyToOne(()=>DoctorAppointement , DoctorAppointement=> DoctorAppointement.documents)
   DoctorAppointement : DoctorAppointement

  //  DoctorAppointement

}
 
export default LocalFile;