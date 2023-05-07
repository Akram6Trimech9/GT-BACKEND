import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
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
            path: file.path,
            filename: file.originalname,
            mimetype: file.mimetype
        }));
        return this.homeService.createSlider(slider,imageFiles);
    }

    @Get('slider')
    async getSliders(){        
         return await this.homeService.getAllSliders()
    }

}
