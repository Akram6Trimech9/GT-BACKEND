import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  StreamableFile,
  Res,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import LocalFilesService from '../services/localfile.service';
import { UsersService } from '../services/users.service';

@Controller('uploadedFiles')
@UseInterceptors(ClassSerializerInterceptor)
export default class LocalFilesController {
  constructor(
    private readonly localFilesService: LocalFilesService,
    private readonly userService: UsersService
  ) { }

  @Get('')
  @UseGuards(AccessTokenGuard)
  async getDatabaseUserPicture(@Req() req, @Res({ passthrough: true }) response: Response) {
    const userId = req.user['sub'];
    const user = await this.userService.findOneUser(userId)
    const file = await this.localFilesService.getFileById(user.avatarId);
    const stream = createReadStream(join(process.cwd(), file.path));
    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': file.mimetype
    })
    return new StreamableFile(stream);
  }

  @Get('/:id')
  async getDatabaseFileByUserId(@Param('id') id, @Res({ passthrough: true }) response: Response) {
    const user = await this.userService.findOneUser(id)
    const file = await this.localFilesService.getFileById(user.avatarId);
    const stream = createReadStream(join(process.cwd(), file.path));
    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': file.mimetype
    })
    return new StreamableFile(stream);
  }
  @Get('avatar/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './uploadedFiles/avatar' });
  }
  @Get('slider/:imgpath')
  seeUploadedSliders(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './uploadedFiles/slider' });
  }
  @Get('history-pic/:imgpath')
  UploadedSliders(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './uploadedFiles/history-pic' });
  }
  @Get('blog/:imgpath')
  UploadedBlog(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './uploadedFiles/blog' });
  }
}