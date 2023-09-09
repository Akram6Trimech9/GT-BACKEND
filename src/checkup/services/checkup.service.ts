import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCheckupDto } from '../dto/create-checkup.dto';
import { UpdateCheckupDto } from '../dto/update-checkup.dto';
import { checkupoffers } from '../entities/checkkuparticles';
 import { CheckupCategory } from '../entities/checkup-category.entity';

@Injectable()
export class CheckupService {
  constructor(
    @InjectRepository(CheckupCategory)
    private checkRepository: Repository<CheckupCategory>,
    @InjectRepository(checkupoffers)
    private checkOffersRepository: Repository<checkupoffers>
  ) {}

  async create(createCheckupDto: CreateCheckupDto): Promise<CheckupCategory> {
    const checkCategory = this.checkRepository.create(createCheckupDto);
    return await this.checkRepository.save(checkCategory);
  }

  async createOffer(offers: checkupoffers, category: string): Promise<checkupoffers> {
    const checkUpcategory = await this.checkRepository.findOne({ where: { id: category } });
    const checkupOffer = this.checkOffersRepository.create(offers);
    checkupOffer.checkuCategory = checkUpcategory;
    return await this.checkOffersRepository.save(checkupOffer);
  }

  async findAll(): Promise<CheckupCategory[]> {
    return await this.checkRepository.find();
  }

  async findAllOffers(): Promise<checkupoffers[]> {
    return await this.checkOffersRepository.find();
  }

  async findOne(id: string): Promise<CheckupCategory | undefined> {
    return await this.checkRepository.findOne({
      where:{
         id :id 
      }
    });
  }

  async update(id: string, updateCheckupDto: UpdateCheckupDto): Promise<CheckupCategory> {
    await this.checkRepository.update(id, updateCheckupDto);
    return await this.checkRepository.findOne({
      where:{
         id :id 
      }
    });
  }

  async remove(id: string): Promise<void> {
 const checkCategory = await this.checkRepository.findOne({
   where:{ id : id}
 }) 
  if( checkCategory.checkupoffers.length> 0 ){ 
    checkCategory.checkupoffers.forEach(async item => { 
        await this.checkOffersRepository.delete(item.id)
    })
  }
    await this.checkRepository.delete(id);
  }

  async removeOffer(id: string): Promise<void> {
    await this.checkOffersRepository.delete(id);
  }
}
