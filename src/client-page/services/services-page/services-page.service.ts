import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AgencyInfo } from 'src/client-page/entities/services-page/agency-info';
import { Interventions } from 'src/client-page/entities/services-page/interventsion';
import { Repository } from 'typeorm';

@Injectable()
export class ServicesPageService {
  constructor(
    @InjectRepository(Interventions)
    private interventionsRepository: Repository<Interventions>,
    @InjectRepository(AgencyInfo)
    private infoRepository: Repository<AgencyInfo>,
  ) { }

  async getInterventions(): Promise<Interventions[]> {
    return await this.interventionsRepository.find();
  }
  async postInterventions(intervention: any): Promise<any> {
    return await this.interventionsRepository.save(intervention);
  }

  async getInterventionById(id: string): Promise<Interventions> {
    return await this.interventionsRepository.findOneBy({ id });
  }

  async updateInterventionById(
    id: string,
    interventions: Partial<Interventions>,
  ): Promise<Interventions> {
    await this.interventionsRepository.update(id, interventions);
    return this.interventionsRepository.findOneBy({ id });
  }


  async deleteInterventionById(id: string): Promise<void> {
    await this.interventionsRepository.delete(id);
  }


  async getQualities(): Promise<AgencyInfo[]> {
    return await this.infoRepository.find();
  }

  async getQualityById(id: string): Promise<AgencyInfo> {
    return await this.infoRepository.findOneBy({ id });
  }

  async postQualities(qualities: AgencyInfo): Promise<any> {
    return await this.infoRepository.save(qualities)
  }
  async updateQualityById(
    id: string,
    quality: Partial<AgencyInfo>,
  ): Promise<AgencyInfo> {
    await this.infoRepository.update(id, quality);
    return this.infoRepository.findOneBy({ id });
  }
  async deleteQualityById(id: string): Promise<void> {
    await this.infoRepository.delete(id);
  }

}

