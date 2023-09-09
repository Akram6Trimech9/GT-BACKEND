import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConsultationfeedbackService } from './consultationfeedback.service';
import { CreateConsultationfeedbackDto } from './dto/create-consultationfeedback.dto';
import { UpdateConsultationfeedbackDto } from './dto/update-consultationfeedback.dto';

@Controller('consultationfeedback')
export class ConsultationfeedbackController {
  constructor(private readonly consultationfeedbackService: ConsultationfeedbackService ) {}

  @Post()
  async create(@Body() createConsultationfeedbackDto: any) {
    return await  this.consultationfeedbackService.create(createConsultationfeedbackDto);
  }

  @Get()
 async  findAll() {
    return  await this.consultationfeedbackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consultationfeedbackService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConsultationfeedbackDto: UpdateConsultationfeedbackDto) {
    return this.consultationfeedbackService.update(+id, updateConsultationfeedbackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
     
    return this.consultationfeedbackService.remove(id);
  }
}
