import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import IUsersRepository from '../repositories/IUsersRepository';
import IUsersTokenRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface RequestDTO {
  password: string;
  token: string;
}

@injectable()
class ReserPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUsersTokenRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ password, token }: RequestDTO): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('Usere token does not exist!');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('Usere does not exist!');
    }

    const tokenCreateAt = userToken.created_at;
    const compradeDate = addHours(tokenCreateAt, 2);

    if (isAfter(Date.now(), compradeDate)) {
      throw new AppError('Token expired!');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ReserPasswordService;
