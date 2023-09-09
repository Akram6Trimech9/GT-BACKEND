import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Observable } from 'rxjs';
import LocalFile from 'src/users/entities/localfile';
import { RoomService } from './services/room/room.service';
const path = require('path');
 

@Controller('chat')
export class ChatController {
    constructor(private readonly roomService: RoomService) { }

    
    @Get('/:roomdid')
   async findRoomByid(@Param('roomdid') id :string ) : Promise<any>{ 
     return await  this.roomService.getRoom(id)
   }
}