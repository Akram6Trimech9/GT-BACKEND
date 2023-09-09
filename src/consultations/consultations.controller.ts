import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import LocalFile from 'src/users/entities/localfile';
const path = require('path');
import { ConsultationService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { Consultation } from './entities/consultation.entity';

@Controller('consultation')
export class ConsultationsController {
    constructor(private readonly consultationService: ConsultationService) { }

    @Get('shared/:userId')
    async getSharedConsultations(@Param('userId') userId: string) {
        return this.consultationService.getConsultationsSharedWithUser(userId);
    }
    
    @Post()
    @UseInterceptors(FilesInterceptor('documents', 10, {
        limits: {
            fileSize: 1024 * 1024 * 5,
        },
        fileFilter: (req, file, callback) => {
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            callback(null, allowedMimeTypes.includes(file.mimetype));
        },
        storage: diskStorage({
            destination: './uploadedFiles/consultation',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = file.originalname
                callback(null, uniqueSuffix + ext);
            },
        }),
    }))
    async create(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() createConsultationDto: any
    ): Promise<Consultation> {
        const savedFiles: LocalFile[] = [];
        for (const file of files) {
            const newFile = new LocalFile();
            newFile.filename = file.filename;
            newFile.path = `http://localhost:3000/api/${file.path}`,
                newFile.mimetype = file.mimetype;
            savedFiles.push(await this.consultationService.saveFile(newFile));
        }
        createConsultationDto.documents = savedFiles;
        return await this.consultationService.create(createConsultationDto);
    }

    @Get()
    async findAll(): Promise<Consultation[]> {
        return await this.consultationService.getConsultations();
    }
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<any> {
        return await this.consultationService.remove(id);
    }
    @Patch(':consultationId/share')
    async shareConsultation(@Param('consultationId') consultationId: string, @Body() userIds: any): Promise<Consultation> {
        return await this.consultationService.shareConsultationWithUsers(consultationId, userIds);
    }
    @Get(':clientId')
    async getConsultationByClient (@Param('clientId') clientId: string): Promise<Consultation[]> {
        return await this.consultationService.getConsultationByClient(clientId);
    }

}
