import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CheckupService } from '../services/checkup.service';
import { CreateCheckupDto } from '../dto/create-checkup.dto';
import { UpdateCheckupDto } from '../dto/update-checkup.dto';
import { checkupoffers } from '../entities/checkkuparticles';
 
@Controller('checkup')
export class CheckupController {
  constructor(private readonly checkupService: CheckupService) {}

  @Post()
  async create(@Body() createCheckupDto: CreateCheckupDto) {
    return await this.checkupService.create(createCheckupDto);
  }

  @Get()
  async findAll() {
    return await this.checkupService.findAll();
  }

  @Post('/offer/:category')
  async createOffer(@Param('category') category: string, @Body() createCheckupOffer: checkupoffers) {
    return await this.checkupService.createOffer(createCheckupOffer, category);
  }

  @Get('/offer')
  async findAllOffers() {
    return await this.checkupService.findAllOffers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.checkupService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCheckupDto: UpdateCheckupDto) {
    return await this.checkupService.update(id, updateCheckupDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.checkupService.remove(id);
  }
  @Delete('/offer/:id')
  async removeOffer(@Param('id') id: string) {
    return await this.checkupService.removeOffer(id);
  }
}
