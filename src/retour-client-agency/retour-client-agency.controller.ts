import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { RetourClientAgencyService } from './retour-client-agency.service';
import { CreateRetourClientAgencyDto } from './dto/create-retour-client-agency.dto';
import { UpdateRetourClientAgencyDto } from './dto/update-retour-client-agency.dto';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RetourClientAgency } from './entities/retour-client-agency.entity';
import LocalFile from 'src/users/entities/localfile';

@Controller('retour-client-agency')
export class RetourClientAgencyController {
  constructor(private readonly retourClientAgencyService: RetourClientAgencyService ) {}

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
        destination: './uploadedFiles/retourpourlesclients',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = file.originalname 
            callback(null, uniqueSuffix + ext);
        },
    }),
}))
  async create(
      @UploadedFiles() files: Express.Multer.File[],
      @Body() retour: any
  ): Promise<RetourClientAgency> {     
      const savedFiles: LocalFile[] = [];
      for (const file of files) {
          const newFile = new LocalFile();
          newFile.filename = file.filename;
          newFile.path = `http://localhost:3000/api/${file.path}`,
          newFile.mimetype = file.mimetype;
         savedFiles.push(await this.retourClientAgencyService.saveFile(newFile));
      }
      retour.documents = savedFiles;
      return await this.retourClientAgencyService.create(retour);
  }
  
   @Get()
   async findAll(): Promise<RetourClientAgency[]> {
      return await this.retourClientAgencyService.findAll();
  }
  @Get('/:id')
  async findOneByReciever( @Param('id') id :string ) : Promise<RetourClientAgency[]> {
     return await this.retourClientAgencyService.findAllByDoctor(id);
 }
 
 @Delete("/:id") 
 async delete(@Param('id') id :string ){ 
       return await this.retourClientAgencyService.delete(id) 
 }
}
