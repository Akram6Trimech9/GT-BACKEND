import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import LocalFile from 'src/users/entities/localfile';
import { DeepPartial, Repository } from 'typeorm';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { Question } from '../entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(LocalFile)
    private readonly localFileRepository: Repository<LocalFile>,
     @InjectRepository(Question)
  private questionRepository:Repository<Question> , 
  ){}
  

  async create(createQuestionDto: Question, files : any): Promise<any> {
    const question  =  await this.questionRepository.create(createQuestionDto);
    question.createdBy = createQuestionDto.createdBy;
    question.documents=files
    return this.questionRepository.save(question);
  } 

  async  createwithoutDocs(createQuestionDto: Question): Promise<any> {
    const question  =  await this.questionRepository.create(createQuestionDto);
    question.createdBy = createQuestionDto.createdBy;
     return this.questionRepository.save(question);
  } 
 
  async saveFile(file: LocalFile): Promise<LocalFile> {    
    return await this.localFileRepository.save(file);
  }

  async findAll(take: number, skip: number): Promise<any> {
    return this.questionRepository.findAndCount({
        take: take,
        skip: skip,
        relations: ["service", "documents", "createdBy", "comments","comments.createdBy", "savedBy"],
        order: {
          createdAt: "DESC" 
        }
        
    });
}



  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
