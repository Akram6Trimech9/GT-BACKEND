import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import LocalFile from '../entities/localfile';
  
@Injectable()
class LocalFilesService {
  constructor(
    @InjectRepository(LocalFile)
    private localFilesRepository: Repository<LocalFile>,
  ) {}
 
  async saveLocalFileData(fileData: LocalFileDto) {
    const path = `${process.env.BACKAPI}/${fileData.path}`
    fileData.path=path
    const newFile = await this.localFilesRepository.create(fileData)
    await this.localFilesRepository.save(newFile);
    return newFile;
  }
  async getFileById(fileId: string) {
    const file = await this.localFilesRepository.findOneBy({id :fileId});
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }
  async saveLocalFilesData(filesData: LocalFileDto[]) {
    const newFiles = [];
    for (const fileData of filesData) {
      const newFile = await this.localFilesRepository.create(fileData);
      await this.localFilesRepository.save(newFile);
      newFiles.push(newFile);
    }
    return newFiles;
  }
  
  
}
 
export default LocalFilesService;