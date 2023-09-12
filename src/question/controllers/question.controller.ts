import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { QuestionService } from '../services/question.service';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import {  UseInterceptors, UploadedFiles } from '@nestjs/common';
 import { diskStorage } from 'multer';
 const path = require('path');
import { FilesInterceptor } from '@nestjs/platform-express';
 import LocalFile from 'src/users/entities/localfile';
import { Question } from '../entities/question.entity';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

 
  @Post()
  @UseInterceptors(FilesInterceptor('documents', 2, {
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        callback(null, allowedMimeTypes.includes(file.mimetype));
    },
    storage: diskStorage({
        destination: './uploadedFiles/questions',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = file.originalname
            callback(null, uniqueSuffix + ext);
        },
    }),
}))
  async createwithDoc(   @UploadedFiles() files: Express.Multer.File[], @Body() createPostvDto: Question) {
    console.log(createPostvDto);
    
    const savedFiles: LocalFile[] = [];
     
    for (const file of files) {
        const newFile = new LocalFile();
        newFile.filename = file.filename;
        newFile.path = `http://localhost:3000/api/${file.path}`,
            newFile.mimetype = file.mimetype;
        savedFiles.push(await this.questionService.saveFile(newFile));
    }
     return this.questionService.create(createPostvDto , savedFiles );
  }

  @Post("withoutdocs")
  async create( @Body() createPostvDto: Question) {
     return this.questionService.createwithoutDocs(createPostvDto);
  }
  



  @Get()
  findAll(@Query('take') take: string, @Query('skip') skip: string) {
      const itemsToTake = Number(take) > 20 ? 20 : Number(take);
      return this.questionService.findAll(itemsToTake, Number(skip));
  }
  


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}
