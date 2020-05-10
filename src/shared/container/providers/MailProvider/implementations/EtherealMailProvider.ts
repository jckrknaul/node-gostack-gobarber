import IMailProvider from '../models/IMailProvider';
import nodeMailer, { Transporter } from 'nodemailer';


export default class EtherealMailProvider implements IMailProvider {

  private client: Transporter;

  constructor(){
    const account = nodeMailer.createTestAccount().then(account => {
      const transporter = nodeMailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        }
      });

      this.client = transporter;
    });
  }


  public async sendMail(to: string, body: string): Promise<void>{
    const message = await this.client.sendMail({
      from: 'Equipe GoBarber <equipe@gobarber.com.br>',
      to,
      subject: 'Recuperação de senha',
      text: body,
    });

    console.log('Mensagem enviada: %s', message.messageId);
    console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(message));
  }
}
