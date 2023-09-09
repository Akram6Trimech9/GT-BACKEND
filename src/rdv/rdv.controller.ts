import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
 import { diskStorage } from 'multer';
 const path = require('path');

 import { RdvService } from './rdv.service';
import { CreateRdvDto } from './dto/create-rdv.dto';
import { UpdateRdvDto } from './dto/update-rdv.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
 import LocalFile from 'src/users/entities/localfile';

@Controller('rdv')
export class RdvController {
  constructor(private readonly rdvService: RdvService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('documents', 10, {
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        callback(null, allowedMimeTypes.includes(file.mimetype));
    },
    storage: diskStorage({
        destination: './uploadedFiles/rendezvousdocuments',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = file.originalname
            callback(null, uniqueSuffix + ext);
        },
    }),
}))
  async create(   @UploadedFiles() files: Express.Multer.File[], @Body() createRdvDto: CreateRdvDto) {
    console.log(files);
    
    const savedFiles: LocalFile[] = [];
     
    for (const file of files) {
        const newFile = new LocalFile();
        newFile.filename = file.filename;
        newFile.path = `http://localhost:3000/api/${file.path}`,
            newFile.mimetype = file.mimetype;
        savedFiles.push(await this.rdvService.saveFile(newFile));
    }
     return this.rdvService.create(createRdvDto , savedFiles );
  }

  
  @Get('accept/:id')
  accept(@Param('id') id: string) {
    return this.rdvService.accept(id);
  }

  @Patch('refuse/:id')
  refuse(@Param('id') id: string) {
    return this.rdvService.refuse(id);
  }

  @Get()
  getAll(){
    return this.rdvService.findAll()
  } 
  @Get('accepted')
  getallAccepted(){ 
      return this.rdvService.allAcceptedRdv()
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rdvService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRdvDto: UpdateRdvDto) {
    return this.rdvService.update(+id, updateRdvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rdvService.remove(id);
  }
}
