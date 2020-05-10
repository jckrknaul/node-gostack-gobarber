import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import User from '../infra/typeorm/entities/Users';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface RequestDTO {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ name, email, password }: RequestDTO): Promise<User> {
    const existUser = await this.usersRepository.findByEmail(email);
    //const existUser = false;

    if (existUser) {
      throw new AppError('This email already exist!', 401);
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
