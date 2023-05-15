import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/client-page/entities/client-page/comments';
import { Horaires } from 'src/client-page/entities/client-page/horaires';
 import { Slider } from 'src/client-page/entities/client-page/slider';
import LocalFile from 'src/users/entities/localfile';
import { User } from 'src/users/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class HomePageService {
  constructor(
    @InjectRepository(Slider) private sliderRepository: Repository<Slider>,
    @InjectRepository(Horaires) private horairesRepository: Repository<Horaires>,
    @InjectRepository(LocalFile) private imagesRepository: Repository<LocalFile>,
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,    
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  async createSlider(slider: Slider, imageFiles: any): Promise<Slider> {
    const existingSliders = await this.sliderRepository.find();
    if (existingSliders.length > 0) {
      throw new Error('Only one slider is allowed');
    }
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
    return await this.sliderRepository.findOne({
      where: { id: sliderId },
      relations: ['images']
    });
  }

  async updateSlider(sliderId: string, slider: Slider , imageFiles): Promise<Slider> {
   
    if(slider.images ){
      slider.images.forEach( item => { 
         if(item != (null || undefined)  ){
          imageFiles.push(...slider.images)
        }
      })
      console.log(imageFiles);
    }
    const updatedSlider = await this.getSliderById(sliderId);
    if (updatedSlider) {
       updatedSlider.title = slider.title ?? updatedSlider.title;
       updatedSlider.description = slider.description ?? updatedSlider.description;
 
       if (imageFiles && imageFiles.length > 0) {
           const existingImages = updatedSlider.images;
          await Promise.all(existingImages.map(localFile => this.imagesRepository.delete(localFile.id)));
 
           const images = await Promise.all(
             imageFiles.map(async (element: LocalFile) => {
                return await this.imagesRepository.save(element);
             })
          );
          updatedSlider.images = images;
       }
 
       return this.sliderRepository.save(updatedSlider);
    }
    return null;
 }
 
  async deleteSlider(sliderId: string): Promise<void> {
    const slider = await this.sliderRepository.findOne({
      where: { id: sliderId },
      relations: ['images']
    });
    if (!slider) {
      throw new Error(`Slider with ID ${sliderId} not found`);
    }
  
    const localFiles = slider.images;
    await Promise.all(localFiles.map(localFile => this.imagesRepository.delete(localFile.id)));
    await this.sliderRepository.delete(sliderId);
  }

  async deleteSliderPicture(idImage: string): Promise<void> {
     const sliders = await this.sliderRepository.find({
      relations: ['images'],
    });
    let sliderToUpdate;
    sliders.forEach((slider) => {
      const index = slider.images.findIndex((image) => image.id === idImage);
      if (index !== -1) {
        sliderToUpdate = slider;
        sliderToUpdate.images.splice(index, 1);
      }
    });
     await this.imagesRepository.delete(idImage);
     if (sliderToUpdate) {
      await this.sliderRepository.save(sliderToUpdate);
    }
  }
    /**************************/
    /****************Horraire**/
    /**************************/


    async createHorraire(horraire: any): Promise<any> {
        
      return await this.horairesRepository.save(horraire);
    }
  
    async getAllHorraires(): Promise<Horaires[]> {
      return await this.horairesRepository.find({});
    }
  
    async getHorraireById(id: string): Promise<Horaires> { 
      return await this.horairesRepository.findOneBy({ id });
    }
  
    async deleteHorraire(id: string): Promise<void> {
      await this.horairesRepository.delete({ id });
    }
  
    async updateHorraire(id: string, horraire: Horaires): Promise<Horaires> {
      const existHorraire = await this.horairesRepository.findOneBy({ id });
      if (!existHorraire) {
        throw new Error(`Horraire with id ${id} not found`);
      }
      const updatedHorraire = Object.assign(existHorraire, horraire);
      return await this.horairesRepository.save(updatedHorraire);
    }
    
    /**************** */
    /********comments */
    /*************** */
    async createComment(comment: Comments, userId: string): Promise<Comments> {
      const user = await this.userRepository.findOneBy({id : userId});
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      comment.users = user;
      return await this.commentsRepository.save(comment);
    }
  
    async findAllComments(): Promise<Comments[]> {
      return await this.commentsRepository.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.users', 'user')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .getMany();
    }
  
    async findOne(id: string): Promise<Comments> {
      const comment = await this.commentsRepository.findOne({
        where:{ id : id } ,
        relations:{users : true}
      });
      if (!comment) {
        throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
      }
      return comment;
    }
  
    async update(id: string, comment: Comments): Promise<Comments> {
      const existingComment = await this.commentsRepository.findOneBy({id: id});
      if (!existingComment) {
        throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
      }
      return await this.commentsRepository.save({
        ...existingComment,
        ...comment,
      });
    }
  
    async removeComment(id: string): Promise<void> {
      const comment = await this.commentsRepository.findOneBy({id :id});
      if (!comment) {
        throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
      }
      await this.commentsRepository.delete(id);
    }
}
