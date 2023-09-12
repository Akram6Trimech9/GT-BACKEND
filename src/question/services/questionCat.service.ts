import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import LocalFile from 'src/users/entities/localfile';
import { DeepPartial, Repository } from 'typeorm';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { QuestionComment } from '../entities/comment.entity';
import { Question } from '../entities/question.entity';
import { QuestionCategory } from '../entities/questionService.entity';

@Injectable()
export class QuestionCatService {
  constructor(
    @InjectRepository(LocalFile)
    private readonly localFileRepository: Repository<LocalFile>,
     @InjectRepository(QuestionCategory)
  private categoryRepository:Repository<QuestionCategory> , 
  @InjectRepository(QuestionComment)
  private commentRepository:Repository<QuestionComment> , 
  ){}
  
 async  create( category : QuestionCategory) : Promise<any>{ 
     const newCat = await  this.categoryRepository.create(category)
     return await this.categoryRepository.save(newCat)
 } 
    
 async findAll() : Promise<any>{ 
     return   await this.categoryRepository.find()
 }
 async remove( id :string ) : Promise<any> { 
     return   await  this.categoryRepository.delete(id )
 }

 async createComment(comment : QuestionComment) : Promise<any>{ 
    const createComment = await this.commentRepository.create(comment)
     return await this.commentRepository.save(createComment)
 }
}