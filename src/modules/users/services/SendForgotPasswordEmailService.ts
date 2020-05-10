import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

//import User from '../infra/typeorm/entities/Users';
import IUsersRepository from '../repositories/IUsersRepository';
import IUsersTokenRepository from '../repositories/IUserTokensRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

interface RequestDTO {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUsersTokenRepository,
  ) {}

  public async execute({ email }: RequestDTO): Promise<void> {

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exist!');
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    await this.mailProvider.sendMail(
      email,
      `Pedido de recueração de senha recebido: ${token}`,
    );
  }
}

export default SendForgotPasswordEmailService;
