import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import LocalFile from 'src/users/entities/localfile';
import { DoctorAppointementService } from './doctor-appointement.service';
import { CreateDoctorAppointementDto } from './dto/create-doctor-appointement.dto';
import { UpdateDoctorAppointementDto } from './dto/update-doctor-appointement.dto';

@Controller('doctor-appointement')
export class DoctorAppointementController {
  constructor(private readonly doctorAppointementService: DoctorAppointementService) {}

  @Post()
 async  create(@Body() createDoctorAppointementDto: CreateDoctorAppointementDto) {
    return  await this.doctorAppointementService.create(createDoctorAppointementDto);
  }

  @Post("documents")
  @UseInterceptors(FilesInterceptor('documents', 10, {
      limits: {
          fileSize: 1024 * 1024 * 5,
      },
      fileFilter: (req, file, callback) => {
          const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
          callback(null, allowedMimeTypes.includes(file.mimetype));
      },
      storage: diskStorage({
          destination: './uploadedFiles/consultation',
          filename: (req, file, callback) => {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
              const ext = file.originalname
              callback(null, uniqueSuffix + ext);
          },
      }),
  }))
  async createItWithDocuments(  @UploadedFiles() files: Express.Multer.File[], @Body() createDoctorAppointementDto: CreateDoctorAppointementDto) {
    const savedFiles: LocalFile[] = [];
    for (const file of files) {
        const newFile = new LocalFile();
        newFile.filename = file.filename;
        newFile.path = `http://localhost:3000/api/${file.path}`,
            newFile.mimetype = file.mimetype;
        savedFiles.push(await this.doctorAppointementService.saveFile(newFile));
    }
    createDoctorAppointementDto.documents = savedFiles;
    return this.doctorAppointementService.createWithDocs(createDoctorAppointementDto);
  }


  @Get()
  findAll() {
    return this.doctorAppointementService.findAll();
  }

  @Get(':id')
 async  findTodayAppointment(@Param('id') id: string) {  
    return  await this.doctorAppointementService.findTodayAppointment(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorAppointementDto: UpdateDoctorAppointementDto) {
    return this.doctorAppointementService.update(+id, updateDoctorAppointementDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await  this.doctorAppointementService.remove(id);
  }
}
