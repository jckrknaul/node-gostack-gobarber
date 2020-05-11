import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/Users';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface RequestDTO {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfile {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ user_id, name, email, old_password, password }: RequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new AppError('Usuário não encontrado!');
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if(userWithSameEmail && userWithSameEmail.id !== user_id) {
      throw new AppError('E-mail ja esta em uso!');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError('Você precisa setar a senha antiga para atualizar a nova senha!');
    }

    if (password && old_password) {
      const checkOldPass = await this.hashProvider.compareHash(old_password, user.password);

      if (!checkOldPass) {
        throw new AppError('Senhas não conferem!');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfile;
