import { Injectable } from '@nestjs/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswerQuestion } from 'src/client-page/entities/apropos-page/faq-et-autres';
import { history } from 'src/client-page/entities/apropos-page/history.entity';
import { subscriber } from 'src/client-page/entities/apropos-page/subscribers.entity';
import LocalFile from 'src/users/entities/localfile';
import { MailService } from 'src/users/services/Mail.service';
import { Repository } from 'typeorm';

@Injectable()
export class AproposPageService {
 constructor(
    @InjectRepository(history) private hisotryRepository: Repository<history>,
    @InjectRepository(AnswerQuestion) private faqndstaffRepository: Repository<AnswerQuestion>,
    @InjectRepository(subscriber) private subRepository: Repository<subscriber>,
    @InjectRepository(LocalFile) private imagesRepository: Repository<LocalFile>,
    private EmailService : MailService 

 ){}

  async checkrepo(repo : any ){ 
     const  exist = await repo.find({})
    if(exist.length > 1){
       throw   new Error(` only one file can be added remove the existing one `);
      }
  }


  async createhisotry(history: history): Promise<any> {       
    await this.checkrepo(this.hisotryRepository)
 const  image =    await this.imagesRepository.save(history.history_picture);
    history.history_picture = image;
   const newHistory = await this.hisotryRepository.create(history);
    return await this.hisotryRepository.save(newHistory)
 }

 async getAllhistory(): Promise<history[]> {
   return await this.hisotryRepository.find({relations:{
      history_picture:true  
      }});
 }

 async gethistoryById(id: string): Promise<history> { 
   return await this.hisotryRepository.findOneBy({ id });
 }

 async deleteHistory(id: string): Promise<void> {
   await this.hisotryRepository.delete({ id });
 }
 async deleteAllHistory(): Promise<any> {
   return await this.hisotryRepository.delete({});
 }


 async updateHistory(id: string, History: history): Promise<history> {
   const existHistory = await this.hisotryRepository.findOneBy({ id });
   if (!existHistory) {
     throw new Error(`History with id ${id} not found`);
   }
   const updatedHistory= Object.assign(existHistory, history);
   return await this.hisotryRepository.save(updatedHistory);
 }
 async createAnswerQuestion(horraire: any): Promise<any> {
        
   return await this.faqndstaffRepository.save(horraire);
 }

 async getAllAnswerQuestion(): Promise<AnswerQuestion[]> {
   return await this.faqndstaffRepository.find({});
 }

 async getAnswerQuestionById(id: string): Promise<AnswerQuestion> { 
   return await this.faqndstaffRepository.findOneBy({ id });
 }

 async deleteAnswerQuestion(id: string): Promise<void> {
   await this.faqndstaffRepository.delete({ id });
 }

 async updateAnswerQuestion(id: string, AnswerQuestion: AnswerQuestion): Promise<AnswerQuestion> {
   const existQnA = await this.faqndstaffRepository.findOneBy({ id });
   if (!existQnA) {
     throw new Error(`updatedQnA with id ${id} not found`);
   }
   const updatedQnA= Object.assign(existQnA, AnswerQuestion);
   return await this.faqndstaffRepository.save(updatedQnA);
 }
 async createSubscriber(Subscriber: any): Promise<any> {
        
   return await this.subRepository.save(Subscriber);
 }

 async getAllSubscriber(): Promise<subscriber[]> {
   return await this.subRepository.find({});
 }

 async getSubscriberById(id: string): Promise<subscriber> { 
   return await this.subRepository.findOneBy({ id });
 }

 async deleteSubscriber(id: string): Promise<void> {
   await this.subRepository.delete({ id });
 }

 async sendEmailToSubscribers(formdata: any): Promise<void> {
  const subscribers = await this.getAllSubscriber();
  const maillist = subscribers.map((item) => item.email);
  const emailObj = {
    object: formdata.object,
    content: formdata.content,
  };
  const attachments = formdata.files?.map(file => ({
    filename: file.originalname,
    content: file.buffer,
  }));
  await this.EmailService.sendEmailToSubs(emailObj, maillist, attachments);
}


}
