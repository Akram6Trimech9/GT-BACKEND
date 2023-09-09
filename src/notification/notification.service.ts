import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
 import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor( @InjectRepository(Notification)
  private  notifRepository: Repository<Notification>){
  }

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = new Notification();
    notification.sender = createNotificationDto.sender;
    notification.receiver = createNotificationDto.reciever; // There's a typo in DTO property, should it be "receiver"?
    notification.message = createNotificationDto.message;

    return this.notifRepository.save(notification);
}
   
async findAllByReciever(id: string): Promise<Notification[]>  {
  const notifications = await this.notifRepository
    .createQueryBuilder("notification")
    .where("notification.receiverId = :userId", {userId: id})
    .getMany();
  return notifications;
}

    
  findAll() {
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
