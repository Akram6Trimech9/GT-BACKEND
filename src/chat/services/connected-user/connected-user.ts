  import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserI } from "src/users/entities/user.interface";
import { Repository } from "typeorm";
import { ConnectedUserI } from "../../model/connected-user/connected-user-interface";
import { connectedUserEntity } from "../../model/connected-user/connected-user.entity";
 
@Injectable()
export class ConnectedUserService { 
  constructor(@InjectRepository(connectedUserEntity)
            private readonly connectRepository:  Repository<connectedUserEntity>){
            }
            async create(connectedUser: ConnectedUserI): Promise<ConnectedUserI> {
              return this.connectRepository.save(connectedUser);
            }     
    async findByUser(user : UserI): Promise<ConnectedUserI[]>{
        return  await this.connectRepository.findBy({user: user})
    }
    async deleteBySocketId(socketId: string, user: UserI): Promise<void> {
        await this.connectRepository.delete({ socketId, user });
      }
    
    async deleteAll(){ 
        await this.connectRepository.createQueryBuilder()
        .delete()
        .execute()
    }



  }