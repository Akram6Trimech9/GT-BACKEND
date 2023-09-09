import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import LocalFile from 'src/users/entities/localfile';
import { DemandedocService } from './demandedoc.service';
import { AnswerDoc } from './entities/answerdemande.entity';
import { DemandeDoc } from './entities/demandedoc.entity';


@Controller('demande')
export class DemandedocController {
  constructor(private readonly demandeServie: DemandedocService) { }


  @Post('/answer/:id')
  @UseInterceptors(FilesInterceptor('documents', 10, {
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: (req, file, callback) => {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      callback(null, allowedMimeTypes.includes(file.mimetype));
    },
    storage: diskStorage({
      destination: './uploadedFiles/demandedoc',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = file.originalname
        callback(null, uniqueSuffix + ext);
      },
    }),
  }))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() answer: any,
    @Param('id') id :string 
  ): Promise<AnswerDoc> {
    const savedFiles: LocalFile[] = [];
    for (const file of files) {
      const newFile = new LocalFile();
      newFile.filename = file.filename;
      newFile.path = `http://localhost:3000/api/${file.path}`,
        newFile.mimetype = file.mimetype;
      savedFiles.push(await this.demandeServie.saveFile(newFile));
    }
     
     return await this.demandeServie.createAnswerForDemande(id ,answer, savedFiles);
  }

  @Get()
  async findAll(): Promise<DemandeDoc[]> {
    return await this.demandeServie.findAll();
  }
  @Get('/reciever/:id')
  async findOneByReciever(@Param('id') id: string): Promise<DemandeDoc[]> {
    return await this.demandeServie.findAllBySharedWith(id);
  }
  
  @Get('/answer/:demande')
  async findAnswerByDemande(@Param('demande') demande: string): Promise<DemandeDoc[]> {
    return await this.demandeServie.findAnswerByDemande(demande);
  }


  @Post()
  async createDemande(@Body() demande: DemandeDoc): Promise<DemandeDoc> {
    return await this.demandeServie.createDemande(demande);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DemandeDoc> {
    return await this.demandeServie.findOneDemande(id);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<void> {
    return await this.demandeServie.deleteDemande(id);
  }
}
