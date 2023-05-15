import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AgencyInfo{
    
    @PrimaryGeneratedColumn("uuid")
    id: string
    
    @Column()
    Qualityone :string 

    @Column()
    Qualitytwo :string 

    @Column()
    contact_info : string 

    @Column()
    agency_email : string 

    @Column()
    agency_number  : string 

    @Column()
    agency_facebook_link : string 

    @Column()
    agency_linked_in_link  : string 

    @Column()
    agency_footer_info  : string 
}