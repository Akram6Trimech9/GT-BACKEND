import { Controller, Get, Post, Delete, Put, Body, Param, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { blog } from 'src/client-page/entities/contact-blog/blog';
import { ContactPageService } from 'src/client-page/services/contact-blog/contact-page.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import LocalFile from 'src/users/entities/localfile';
 
@Controller('contact-blog')
export class ContactPageController {
  constructor(private readonly contactPageService: ContactPageService) {}

  @Post('blog')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
      fileFilter: (req, file, callback) => {        
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        callback(null, allowedMimeTypes.includes(file.mimetype));
      },
      storage: diskStorage({
        destination: './uploadedFiles/blog',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname);
          callback(null, `${uniqueSuffix}${extension}`);                  
        },
      }),
    }),
  ) 
  async postBlog( @Body() blogData : any  , @UploadedFile() file: Express.Multer.File): Promise<any> {
    const   bl= new blog()
    bl.desciption=blogData.desciption
    bl.title=blogData.title
    bl.sub_title=blogData.sub_title    
    const localFile = new LocalFile();
    localFile.filename = file.filename;
    localFile.path =`http://localhost:3000/api/${file.path}`;
    localFile.mimetype = file.mimetype;
    return await this.contactPageService.postBlog(bl, localFile);
  }

  @Get('blog')
  async getBlogs(): Promise<any> {
    return await this.contactPageService.getBlogs();
  }

  @Get('blog/:id')
  async getBlogById(@Param('id') id: string): Promise<any> {
    return await this.contactPageService.getBlogById(id);
  }

  @Delete('blog/:id')
  async deleteBlog(@Param('id') id: string): Promise<any> {
    return await this.contactPageService.deleteBlog(id);
  }

  @Put('blog/:id')
  async updateBlog(@Param('id') id: string, @Body() blogData): Promise<any> {
    return await this.contactPageService.updateBlog(id, blogData);
  }

  @Post('contact')
  async postContact(@Body() contactData): Promise<any> {
    return await this.contactPageService.postContact(contactData);
  }

  @Get('contact')
  async getAllContact(): Promise<any> {
    return await this.contactPageService.getAllContact();
  }

  @Delete('contact/:id')
  async deleteContact(@Param('id') id: string): Promise<any> {
    return await this.contactPageService.deleteContact(id);
  }
}
