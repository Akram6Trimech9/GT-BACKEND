import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile, Req, BadRequestException } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/common/guards/RolesGuard';
import { UserDto } from '../dto/user.dto';
import { Role } from '../enums/role';
import { Roles } from '../roles.decorator';
import { UsersService } from '../services/users.service';
import { extname } from 'path';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: UserDto) {    
    return this.usersService.register(createUserDto);
  }

  @Get('/')
  async findAll() {
    return await this.usersService.findAll();
  }
  
  @Get('/search')
  async searchUsers(@Query() query: any) {  
    const  letter= query.letter    
    return await this.usersService.searchUsers(letter);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  
  @ApiOperation({ summary: 'searching for a user by email ' })
  @ApiResponse({ status: 201, description: 'The user has been successfully getted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('/email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }

  @Post('avatar')
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
        destination: './uploadedFiles/avatar',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname);
          callback(null, `${uniqueSuffix}${extension}`);          
        },
      }),
    }),
  )
  async addAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
        
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    const userId = req.user['sub'];
    return await this.usersService.addAvatar(userId, {
      path: file.path,
      filename: file.filename,
      mimetype: file.mimetype,
    });
  }
}
