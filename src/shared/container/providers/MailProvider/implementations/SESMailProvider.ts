import IMailProvider from '../models/IMailProvider';
import nodeMailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import aws from 'aws-sdk';

import mailConfig from '@config/mail';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class SESMailProvider implements IMailProvider {

  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ){
    this.client = nodeMailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: 'sa-east-1'
      })
    });

  }

  public async sendMail({ to, from, subject, templateData }: ISendMailDTO): Promise<void>{
    const { name, email } = mailConfig.defaults.from;

    const data = {
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData)
    }

    //console.log(data);

    await this.client.sendMail(data);
  }
}
