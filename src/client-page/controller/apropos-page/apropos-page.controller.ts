import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
 import { AnswerQuestion } from 'src/client-page/entities/apropos-page/faq-et-autres';
import { history } from 'src/client-page/entities/apropos-page/history.entity';
import { subscriber } from 'src/client-page/entities/apropos-page/subscribers.entity';
import { AproposPageService } from 'src/client-page/services/apropos-page/apropos-page.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import LocalFile from 'src/users/entities/localfile';

@Controller('apropos-page')
export class AproposPageController {
  constructor(private readonly aproposPageService: AproposPageService) {}


@Post('history')
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
      destination: './uploadedFiles/history-pic',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = extname(file.originalname);
        callback(null, `${uniqueSuffix}${extension}`);                  
      },
    }),
  }),
) 
async createHistory( @UploadedFile() file: Express.Multer.File , @Body() history: history): Promise<any> {
     
  if (file) {
    const localFile = new LocalFile();
    localFile.filename = file.filename;
    localFile.path =`http://localhost:3000/api/${file.path}`;
    localFile.mimetype = file.mimetype;
    history.history_picture = localFile;
  }
  return await this.aproposPageService.createhisotry(history);
}

  @Get('history')
  async getAllHistory(): Promise<history[]> {
    return await this.aproposPageService.getAllhistory();
  }

  @Get('history/:id')
  async getHistoryById(@Param('id') id: string): Promise<history> {
    return await this.aproposPageService.gethistoryById(id);
  }

  @Put('history/:id')
  async updateHistory(@Param('id') id: string, @Body() history: history): Promise<history> {
    return await this.aproposPageService.updateHistory(id, history);
  }

  @Delete('history/:id')
  async deleteHistory(@Param('id') id: string): Promise<void> {
    return await this.aproposPageService.deleteHistory(id);
  }
  @Delete('allhistory')
@UseGuards(AccessTokenGuard)
async deleteAllHistory(): Promise<any> {
  return await this.aproposPageService.deleteAllHistory();
}

  @Post('faq')
  async createAnswerQuestion(@Body() AnswerQuestion: AnswerQuestion): Promise<any> {
    return await this.aproposPageService.createAnswerQuestion(AnswerQuestion);
  }

  @Get('faq')
  async getAllAnswerQuestion(): Promise<AnswerQuestion[]> {
    return await this.aproposPageService.getAllAnswerQuestion();
  }

  @Get('faq/:id')
  async getAnswerQuestionById(@Param('id') id: string): Promise<AnswerQuestion> {
    return await this.aproposPageService.getAnswerQuestionById(id);
  }

  @Patch('faq/:id')
  async updateAnswerQuestion(@Param('id') id: string, @Body() AnswerQuestion: AnswerQuestion): Promise<AnswerQuestion> {
    return await this.aproposPageService.updateAnswerQuestion(id, AnswerQuestion);
  }

  @Delete('faq/:id')
  async deleteAnswerQuestion(@Param('id') id: string): Promise<void> {
    return await this.aproposPageService.deleteAnswerQuestion(id);
  }

  @Post('subscriber')
  async createSubscriber(@Body() Subscriber: subscriber): Promise<any> {
    return await this.aproposPageService.createSubscriber(Subscriber);
  }

  @Post('sendemails')
@UseInterceptors(FilesInterceptor('files', 10, {
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  storage: diskStorage({
    destination: './uploadedFiles/attachments',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = file.originalname
      callback(null, uniqueSuffix + ext);
    },
  }),
}))
async sendEmailToSubscriber(@Body() { object, content }: any, @UploadedFiles() files?: Express.Multer.File[]): Promise<any> {
  const subEmail = {
    object: object,
    content: content,
    files: files ? files : undefined,
  };
  return await this.aproposPageService.sendEmailToSubscribers(subEmail);
}
  @Get('subscriber')
  async getAllSubscriber(): Promise<subscriber[]> {
    return await this.aproposPageService.getAllSubscriber();
  }

  @Get('subscriber/:id')
  async getSubscriberById(@Param('id') id: string): Promise<subscriber> {
    return await this.aproposPageService.getSubscriberById(id);
  }
 

  @Delete('subscriber/:id')
  async deleteSubscriber(@Param('id') id: string): Promise<void> {
    return await this.aproposPageService.deleteSubscriber(id);
  }

}
