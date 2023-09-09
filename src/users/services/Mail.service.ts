import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Rdv } from 'src/rdv/entities/rdv.entity';
import { User } from '../entities/user.entity';
 @Injectable()
export class MailService {
  constructor(private mailerService: MailerService,
       
    ) {}

  async sendUserWelcome(user: any, token: string) {    
     const confirmation_url = `${process.env.CLIENT_URL}/confirm?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
       subject: 'Welcome to GT HEALTH ! Confirm your Email',
       template: './confirmation', 
       context: { 
        name: user.name,
        confirmation_url,
      },
    });
  }

  async  forgotpass(user : any , token :string ){
     const reset_url = `${process.env.CLIENT_URL}/forgotPassword?token=${token}`;
    await this.mailerService.sendMail({
        to: user.email,
        subject: 'Forgot Password',
        template: './reset-password', 
        context: { 
         name: user.name,
         reset_url,
    }})
  }
  async sendEmailToSubs(emailObj: { content: string, object: string }, maillist: any[], attachments?: { filename: string, content: Buffer }[]) {
    const content = emailObj.content;
    const mailOptions = {
      to: maillist,
      subject: emailObj.object,
      template: './sendemailtosubs',
      context: {
        content,
      },
    };
    if (attachments && attachments.length > 0) {
      mailOptions['attachments'] = attachments;
    }
    await this.mailerService.sendMail(mailOptions);
  }
  async sendUserRdvAccept(user: any, rdvDetails: any) {
    const dateTime = new Date(rdvDetails.date).toLocaleString();

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Rendezvous Confirmation',
      template: './accept', 
      context: { 
        name: user.firstName,
        date: dateTime,
        additionalNote: rdvDetails.addionalNote || 'None',
        // Add more context details if necessary
      },
    });
}


}