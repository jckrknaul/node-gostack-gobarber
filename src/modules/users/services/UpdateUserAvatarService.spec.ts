import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

import AppError from '@shared/errors/AppError';

let fakeStorageProvider: FakeStorageProvider;
let fakeUserRepository: FakeUsersRepository;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {

  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakeUserRepository = new FakeUsersRepository();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider
    );
  });

  it('Should be able to update a avatar file', async () => {
    const user = await fakeUserRepository.create({
      name: 'Joao Teste',
      email: 'joao@tet.com',
      password: '123456'
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'AvatarFake.jpg'
    });

    expect(user.avatar).toBe('AvatarFake.jpg');
  });

  it('Should not be able to update when non exist user', async () => {
    await expect(updateUserAvatar.execute({
      user_id: 'usuario-inesistente',
      avatarFilename: 'AvatarFake.jpg'
    })).rejects.toBeInstanceOf(AppError);
  });

});
