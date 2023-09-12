import { Module } from '@nestjs/common';
import { QuestionService } from './services/question.service';
import { QuestionController } from './controllers/question.controller';
import LocalFile from 'src/users/entities/localfile';
import { Question } from './entities/question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionComment } from './entities/comment.entity';
import { QuestionCategory } from './entities/questionService.entity';
import { QuestionCategoryController } from './controllers/questCategory.controller';
import { QuestionCatService } from './services/questionCat.service';
import { QuestionCommentController } from './controllers/questComment.controller';

@Module({
  imports :[   
    TypeOrmModule.forFeature([Question , LocalFile , QuestionComment , QuestionCategory])],
  controllers: [QuestionController , QuestionCategoryController,QuestionCommentController],
  providers: [QuestionService,QuestionCatService]
})
export class QuestionModule {}
