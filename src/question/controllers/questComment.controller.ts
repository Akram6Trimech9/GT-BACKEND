import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { QuestionService } from '../services/question.service';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { QuestionCatService } from '../services/questionCat.service';
import { QuestionComment } from '../entities/comment.entity';

@Controller('question-comment')
export class QuestionCommentController {
  constructor(private readonly questionCatService: QuestionCatService) {}

 @Post()
 async create(@Body() createComment: QuestionComment) {
    return  await this.questionCatService.createComment(createComment);
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
