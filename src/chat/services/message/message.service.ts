import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
 import { MessageEntity } from 'src/chat/model/message/message.entity';
import { messageI } from 'src/chat/model/message/message.interface';
 import { RoomI } from 'src/chat/model/room/room.interface';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {


  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>
  ) { }

  async create(message: messageI): Promise<messageI> {
    return this.messageRepository.save(this.messageRepository.create(message));
  }

  async findMessagesForRoom(room: RoomI): Promise<any> {
    const query = this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.room', 'room')
      .where('room.id = :roomId', { roomId: room.id })
      .leftJoinAndSelect('message.user', 'user')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .orderBy('message.createdAt', 'ASC')
      .getMany()
    return query
  }
  
}