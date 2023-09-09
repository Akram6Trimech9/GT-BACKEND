import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import LocalFile from 'src/users/entities/localfile';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { UpdateAnalysisDto } from './dto/update-analysis.dto';
import { Analysis } from './entities/analysis.entity';

@Injectable()
export class AnalysesService {
  constructor(
    @InjectRepository(LocalFile)
    private readonly localFileRepository: Repository<LocalFile>,
    @InjectRepository(Analysis)
    private analysRepo: Repository<Analysis>,
    private _userService: UsersService
  ) {}

  async create(data: Partial<Analysis>): Promise<Analysis> {
     if (typeof data.sharedWith === 'string') {
      try {
        data.sharedWith = JSON.parse(data.sharedWith);
      } catch (error) {
        throw new Error('sharedWith is not a valid JSON string');
      }
    }
     if (!Array.isArray(data.sharedWith)) {
      throw new Error('sharedWith should be an array');
    }
    const analyses: Analysis = this.analysRepo.create(data);
    analyses.sharedWith = data.sharedWith;
    return await this.analysRepo.save(analyses);
  }

  async saveFile(file: LocalFile): Promise<LocalFile> {
    return await this.localFileRepository.save(file);
  }

  async findAll() :Promise<any> {
    return   await this.analysRepo.find()
  }
  async findAllBySharedWith(userId: string): Promise<Analysis[]> {
    return this.analysRepo.createQueryBuilder('analysis')
      .innerJoinAndSelect('analysis.sharedWith', 'user', 'user.id = :userId', { userId })
      .leftJoinAndSelect('analysis.documents', 'document')
      .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} analysis`;
  }

  update(id: number, updateAnalysisDto: UpdateAnalysisDto) {
    return `This action updates a #${id} analysis`;
  }

  remove(id: number) {
    return `This action removes a #${id} analysis`;
  }
}
