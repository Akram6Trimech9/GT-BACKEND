import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Horaires } from 'src/client-page/entities/horaires';
import { Slider } from 'src/client-page/entities/slider';
import LocalFile from 'src/users/entities/localfile';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class HomePageService {
  constructor(
    @InjectRepository(Slider) private sliderRepository: Repository<Slider>,
    @InjectRepository(Horaires) private horairesRepository: Repository<Horaires>,
    @InjectRepository(LocalFile) private imagesRepository: Repository<LocalFile>,

    @InjectEntityManager() private entityManager: EntityManager,
  ) {}
  async createSlider(slider: Slider, imageFiles: any): Promise<Slider> {
    const images = await Promise.all(
      imageFiles.map(async (element: LocalFile) => {
        return await this.imagesRepository.save(element);
      })
    );    
    slider.images = images;
    return await this.sliderRepository.save(slider);
  }
  

  async getAllSliders(): Promise<any[]> {
    const sliders = await this.sliderRepository.find({
      relations :{
        images : true
      }
    })
    return sliders  
}

  

  async getSliderById(sliderId: string): Promise<Slider> {
    return await this.sliderRepository.findOneBy({id : sliderId});
  }

  async updateSlider(sliderId: string, slider: Slider): Promise<Slider> {
    const updatedSlider = await this.getSliderById(sliderId);
    if (updatedSlider) {
      updatedSlider.title = slider.title ?? updatedSlider.title;
      updatedSlider.description = slider.description ?? updatedSlider.description;
      updatedSlider.images = slider.images ?? updatedSlider.images;
      return this.sliderRepository.save(updatedSlider);
    }
    return null;
  }

  async deleteSlider(sliderId: string): Promise<void> {
    await this.sliderRepository.delete(sliderId);
  }
}
