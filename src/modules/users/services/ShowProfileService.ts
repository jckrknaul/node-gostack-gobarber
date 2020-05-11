import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/Users';
import IUsersRepository from '../repositories/IUsersRepository';

interface RequestDTO {
  user_id: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ user_id }: RequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new AppError('Usuário não encontrado!');
    }

    return user;
  }
}

export default ShowProfileService;
