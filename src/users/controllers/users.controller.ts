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
  @Get('patients')
  async findAllUserwithoutDoctors() {
    return  await  this.usersService.findAllPatientsWithoutDoctors();
  }
 
  @Get('/')
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('doctors')
  async getAllDoctors(){ 
     return await this.usersService.findAllDoctors()
  }
  
  @Get('/search')
  async searchUsers(@Query() query: any) {  
    const  letter= query.letter    
    return await this.usersService.searchUsers(letter);
  }

  @Get('/search/doctors')
  async searchDoctors(@Query() query: any) {  
    const  letter= query.letter    
    return await this.usersService.searchDoctors(letter);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

 
  @Get('update/:patientId/:doctorId')
 async  deletePatientFromDoctorList(@Param('patientId') patientId :string, @Param('doctorId') doctorId:string  ){
   return await  this.usersService.deletePatientFromDoctorList(patientId,doctorId)

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
  @Post('addPatient')
  async addPatientToDoctor(
      @Body() obj: any,
  ): Promise<any> {
    await this.usersService.addPatientToDoctor(obj.doctorId, obj.patientId);   
           return     true  
  }
  

  @Patch(':patientId/addDoctor/:doctorId')
  async addDoctorToPatient(
    @Param('patientId') patientId: string,
    @Param('doctorId') doctorId: string,
  ): Promise<any> {
    try {
      const bool=  await this.usersService.addDoctorToPatient(patientId, doctorId);
      return { message: 'Doctor added to the patient successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('patients/:iddoctor')
  async getPatientsByDoctor( @Param('iddoctor') iddoctor : string ) { 
     return await this.usersService.findPatientsByDoctor(iddoctor)
   }

}
