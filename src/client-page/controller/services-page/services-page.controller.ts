import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AgencyInfo } from 'src/client-page/entities/services-page/agency-info';
 import { Interventions } from 'src/client-page/entities/services-page/interventsion';
 import { ServicesPageService } from 'src/client-page/services/services-page/services-page.service';

@Controller('services')
export class ServicesPageController {
    constructor(private readonly servicesPageService: ServicesPageService) {}
    
    @Get('/interventions')
    async getInterventions(): Promise<Interventions[]> {
        return this.servicesPageService.getInterventions();
    }
    
    @Get('/interventions/:id')
    async getInterventionById(@Param('id') id: string): Promise<Interventions> {
        return this.servicesPageService.getInterventionById(id);
    }
    @Post('/interventions')
    async postIntervention(@Body() intervention: Interventions): Promise<any> {
        return  await this.servicesPageService.postInterventions(intervention);
    }
    @Patch('/interventions/:id')
    async updateInterventionById(
        @Param('id') id: string,
        @Body() interventions: Partial<Interventions>,
    ): Promise<Interventions> {
        return this.servicesPageService.updateInterventionById(id, interventions);
    }

    @Delete('/interventions/:id')
    async deleteInterventionById(@Param('id') id: string): Promise<void> {
        return this.servicesPageService.deleteInterventionById(id);
    }
    
    @Get('/qualities')
    async getQualities(): Promise<AgencyInfo[]> {
        return this.servicesPageService.getQualities();
    }
    
    @Post('/qualities')
    async postQualities(@Body() AgencyInfo: AgencyInfo): Promise<any> {
        return  await this.servicesPageService.postQualities(AgencyInfo);
    }
    @Get('/qualities/:id')
    async getQualityById(@Param('id') id: string): Promise<AgencyInfo> {
        return this.servicesPageService.getQualityById(id);
    }
    
    @Patch('/qualities/:id')
    async updateQualityById(
        @Param('id') id : string ,
        @Body() qualities: Partial<AgencyInfo>,
        ): Promise<AgencyInfo> {
            return this.servicesPageService.updateQualityById(id, qualities);
        }
 
    @Delete('/qualities/:id')
    async deleteQualityById(@Param('id') id: string): Promise<void> {
        return this.servicesPageService.deleteQualityById(id);
    }
}