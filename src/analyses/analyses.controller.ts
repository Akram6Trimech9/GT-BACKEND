import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import LocalFile from 'src/users/entities/localfile';
import { AnalysesService } from './analyses.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { UpdateAnalysisDto } from './dto/update-analysis.dto';
import { Analysis } from './entities/analysis.entity';

@Controller('analyses')
export class AnalysesController {
  constructor(private readonly analyserServicee: AnalysesService) {}


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
        destination: './uploadedFiles/analyses',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = file.originalname 
            callback(null, uniqueSuffix + ext);
        },
    }),
}))
  async create(
      @UploadedFiles() files: Express.Multer.File[],
      @Body() analyses: any
  ): Promise<Analysis> {     
      const savedFiles: LocalFile[] = [];
      for (const file of files) {
          const newFile = new LocalFile();
          newFile.filename = file.filename;
          newFile.path = `http://localhost:3000/api/${file.path}`,
          newFile.mimetype = file.mimetype;
         savedFiles.push(await this.analyserServicee.saveFile(newFile));
      }
      analyses.documents = savedFiles;
      return await this.analyserServicee.create(analyses);
  }
  
   @Get()
   async findAll(): Promise<Analysis[]> {
      return await this.analyserServicee.findAll();
  }
  @Get('/reciever/:id')
  async findOneByReciever( @Param('id') id :string ) : Promise<Analysis[]> {
     return await this.analyserServicee.findAllBySharedWith(id);
 }
  // @Delete(':id')
  // async remove(@Param('id') id: string) : Promise<any>{ 
  //    return await this.consultationService.remove(id);
  // }
  // @Patch(':consultationId/share')
  // async shareConsultation(@Param('consultationId') consultationId: string, @Body() userIds: any): Promise<Consultation> {    
  //     return await this.consultationService.shareConsultationWithUsers(consultationId, userIds);
  // }
  
}
