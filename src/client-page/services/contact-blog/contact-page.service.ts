import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { blog } from 'src/client-page/entities/contact-blog/blog';
import { Contacts } from 'src/client-page/entities/contact-blog/contact';
import LocalFile from 'src/users/entities/localfile';
import { Repository } from 'typeorm';

@Injectable()
export class ContactPageService {
    constructor( @InjectRepository(blog)
    private  blogRepository: Repository<blog>,
    @InjectRepository(Contacts)
    private contactsRepository: Repository<Contacts>, 
    @InjectRepository(LocalFile)
    private  imageRepo: Repository<LocalFile>,){
    }

    async postBlog( blog : blog , file : LocalFile ) : Promise<any> {        
      const image =    await this.imageRepo.save(file)
       blog.image = image
         const newBlog = await this.blogRepository.create(blog)       
        return await this.blogRepository.save(newBlog)
     }
    async getBlogById( id : string ) : Promise<blog>{
        return await this.blogRepository.findOneBy({id : id })
    } 
    async getBlogs(): Promise<blog[]>{
        return await this.blogRepository.find({
            relations:{
                image: true
            }
        })
    }
    async deleteBlog(id :string):Promise<any>{ 
        return await this.blogRepository.delete({id : id})
    }
    async updateBlog(
        id: string,
        blog: Partial<blog>,
      ): Promise<blog> {
        await this.blogRepository.update(id, blog);
        return  await this.blogRepository.findOneBy({id});
      }
    async postContact(contact : any ) : Promise<any>{ 
        return await this.contactsRepository.save(contact)
    }  
    async getAllContact() :Promise<Contacts[]>{
        return  await this.contactsRepository.find()
    }
    async deleteContact(id : string ): Promise<void>{
         await this.contactsRepository.delete({id : id })
    } 
}
