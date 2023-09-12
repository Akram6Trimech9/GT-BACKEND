import { Analysis } from "src/analyses/entities/analysis.entity";
import { connectedUserEntity } from "src/chat/model/connected-user/connected-user.entity";
import { JoinedRoomEntity } from "src/chat/model/joined-room/joined-room.entity";
import { MessageEntity } from "src/chat/model/message/message.entity";
import { Room } from "src/chat/model/room/room.entity";
import { Comments } from "src/client-page/entities/client-page/comments";
import { Consultationfeedback } from "src/consultationfeedback/entities/consultationfeedback.entity";
import { Consultation } from "src/consultations/entities/consultation.entity";
import { DemandeDoc } from "src/demandedoc/entities/demandedoc.entity";
import { DoctorAppointement } from "src/doctor-appointement/entities/doctor-appointement.entity";
import { Notification } from "src/notification/entities/notification.entity";
import { QuestionComment } from "src/question/entities/comment.entity";
 import { Question } from "src/question/entities/question.entity";
import { Rdv } from "src/rdv/entities/rdv.entity";
import { RetourClientAgency } from "src/retour-client-agency/entities/retour-client-agency.entity";
import { Sendmessage } from "src/sendmessage/entities/sendmessage.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../enums/role";
import { CompleteInfo } from "./CompleteInfo";
import LocalFile from "./localfile";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string
  @Column()
  firstName: string

  @Column()
  lastName: string

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(
    () => LocalFile,
    {
      nullable: true , eager :true
    },
  )
  public avatar?: LocalFile;

  @Column({ nullable: true })
  public avatarId?: string;

  @OneToMany(() => Rdv, Rdv => Rdv.user, {
    cascade: true
  })
  rdv: Rdv[];

  @Column()
  email: string

  @Column()
  country: string

  @Column()
  password: string

  @Column()
  address: string

  @Column()
  refreshToken: string;

  @Column()
  role: Role

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @OneToOne(() => CompleteInfo, completeInfo => completeInfo.doctor)
  CompletedInfo: CompleteInfo;
  
   @OneToMany(() => connectedUserEntity, connection => connection.user)
  connections: connectedUserEntity[];

  @OneToMany(() => JoinedRoomEntity, joinedRoom => joinedRoom.user)
  joinedRooms: JoinedRoomEntity[];

  @OneToMany(() => MessageEntity, message => message.user)
  messages: MessageEntity[];


  @OneToMany(() => DemandeDoc, doc => doc.sharedWith)
  demands: DemandeDoc[];


  @OneToMany(() => DoctorAppointement, DoctorAppointement => DoctorAppointement.Doctor)
  DoctorAppointement: DoctorAppointement[];

  @OneToMany(() => Notification, notification => notification.sender)
  sentNotifications: Notification[];

  @OneToMany(() => Notification, notification => notification.receiver)
  receivedNotifications: Notification[];

 

  @OneToMany(() => RetourClientAgency, RetourClientAgency => RetourClientAgency.clientId)
  clientsretour: RetourClientAgency[];

  @OneToMany(() => RetourClientAgency, RetourClientAgency => RetourClientAgency.doctor)
  doctorretour: RetourClientAgency[];


  @ManyToMany(() => Room, room => room.users)
  rooms: Room[];

  @OneToMany(() => Consultation, Consultation => Consultation.user )  
  consultation: Consultation[];
  
  @ManyToOne(() => User, user => user.patients)
  doctor?: User;

  @OneToMany(() => User, user => user.doctor)
  patients: User[];

  @OneToMany(() => Consultationfeedback, Consultationfeedback => Consultationfeedback.doctor)
  consultationfeedbacks: Consultationfeedback[];


  @ManyToMany(() => Analysis, Analysis => Analysis.sharedWith )  
  analyses: Analysis[];

  @OneToMany(() => Comments, comment => comment.users)
  comments: Comments[]

  @OneToMany(() => Sendmessage, Sendmessage => Sendmessage.patient)
  sendedMessages: Sendmessage[]

  @ManyToMany(() => Consultation, consultation => consultation.sharedWith)
  sharedConsultation: Consultation[];
  
  @OneToMany(()=> Question , question => question.createdBy)
  questions: Question[]

  @OneToMany(()=> QuestionComment , questionComment =>  questionComment.createdBy)
  questionComment :QuestionComment[]

  @OneToMany(()=>   Question, favorite => favorite.savedBy )
   favoritesPosts : Question[]

  constructor(firstName: string, lastName: string, email: string, country: string, address: string, password: string, role: Role, refreshtoken: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.address = address
    this.country = country
    this.password = password
    this.role = role
    this.refreshToken = refreshtoken
  }

}

