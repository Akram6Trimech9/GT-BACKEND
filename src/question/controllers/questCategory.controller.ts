import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { QuestionService } from '../services/question.service';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { QuestionCatService } from '../services/questionCat.service';

@Controller('question-category')
export class QuestionCategoryController {
  constructor(private readonly questionCatService: QuestionCatService) {}

 @Post()
 create(@Body() createQuestionDto: any) {
     return this.questionCatService.create(createQuestionDto);
 }

 @Get()
 async findAll(){ 
      return await this.questionCatService.findAll()
 }

 
  @Delete(':id')
     remove(@Param('id') id: string) {
   return this.questionCatService.remove(id);
   }
}
