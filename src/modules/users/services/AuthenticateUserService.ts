import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/Users';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface RequesteDTO {
  email: string;
  password: string;
}

interface ResponseDTO {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

  ) {}

  public async execute({ email, password }: RequesteDTO): Promise<ResponseDTO> {

    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Incorrect email/password combination!', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination!', 401);
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
