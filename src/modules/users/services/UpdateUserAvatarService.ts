import path from 'path';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';

import User from '../infra/typeorm/entities/Users';
import IUsersRepository from '../repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvader';

interface RequestDTO {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, avatarFilename }: RequestDTO): Promise<User> {

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Its necessary login for th user!', 401);
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const fileName = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = fileName;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
