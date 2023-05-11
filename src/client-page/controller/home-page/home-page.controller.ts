import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { Horaires } from 'src/client-page/entities/horaires';
import { Slider } from 'src/client-page/entities/slider';
 import { HomePageService } from 'src/client-page/services/home-page/home-page.service';

@Controller('home')
export class HomePageController {
    constructor(private readonly homeService: HomePageService) {

    }
    @Post('slider')
    @UseInterceptors(FilesInterceptor('files', 10, {
        limits: {
            fileSize: 1024 * 1024 * 5, 
        },
        fileFilter: (req, file, callback) => {
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
            callback(null, allowedMimeTypes.includes(file.mimetype));
        },
        storage: diskStorage({
            destination: './uploadedFiles/slider',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = file.originalname 
                callback(null, uniqueSuffix + ext);
            },
        }),
    }))
    async addSliderImages(@UploadedFiles() files: Express.Multer.File[], @Body() slider: any) {                      
        const imageFiles = files.map(file => ({
            path: `http://localhost:3000/api/${file.path}`,
            filename: file.originalname,
            mimetype: file.mimetype
        }));
        return this.homeService.createSlider(slider,imageFiles);
    }

    @Get('slider')
    async getSliders(){        
         return await this.homeService.getAllSliders()
    }

    @Delete('slider/:id')
    async deleteSlider(@Param('id') id : string ){
         return await this.homeService.deleteSlider(id)
    }

    @Delete('slider/picture/:id')
       async delete(@Param('id') id :string){
                 return await this.homeService.deleteSliderPicture(id)   
                }
    @Patch('slider/:id')
    @UseInterceptors(FilesInterceptor('files', 10, {
                limits: {
                    fileSize: 1024 * 1024 * 5, 
                },
                fileFilter: (req, file, callback) => {
                    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
                    callback(null, allowedMimeTypes.includes(file.mimetype));
                },
                storage: diskStorage({
                    destination: './uploadedFiles/slider',
                    filename: (req, file, callback) => {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                        const ext = file.originalname 
                        callback(null, uniqueSuffix + ext);
                    },
                }),
            }))         
    async update(@Param('id') id :string  ,@UploadedFiles() files: Express.Multer.File[], @Body()  slider : Slider){            
        const imageFiles  = files.map(file => ({
            path: `http://localhost:3000/api/${file.path}`,
            filename: file.originalname,
            mimetype: file.mimetype
        }));
        console.log(slider);
        
          
        return await this.homeService.updateSlider(id , slider , imageFiles )
    }         
             /************************* Horraire */
                          /************************* Horraire */
             /************************* Horraire */

    @Post('horraire')
    async addHorraire(@Body() horraire : Horaires) : Promise<any>{
          return await  this.homeService.createHorraire(horraire)
    }
    @Get('horraire')
    async getHorraire(): Promise<any>{ 
         return await this.homeService.getAllHorraires()
    }
    @Patch('horraire/:id')
    async updateHorraire(@Param('id') id : string ,  @Body() Horaires : any   ){ 
        return await this.homeService.updateHorraire(id , Horaires)
    }
    @Delete('horraire/:id')
    async deleteHorraire(@Param('id') id : string ) : Promise<any> {
         return await this.homeService.deleteHorraire(id)
    }
    
    /**************commentaire */
        /**************commentaire */
    /**************commentaire */
    @Get('commentaire')
    async getComments(): Promise<any>{ 
         return await this.homeService.findAllComments()
    }
    @Post('commentaire/:id')
    async addComments(@Param('id') id : string  ,  @Body() Comment : any) : Promise<any>{
          return await  this.homeService.createComment(Comment, id )
    }
    @Delete('commentaire/:id')
    async deleteComment(@Param('id') id : string) : Promise<any>{
          return await  this.homeService.removeComment(id )
    }

}
