import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

import AppError from '@shared/errors/AppError';

let fakeHashProvider: FakeHashProvider;
let fakeUserRepository: FakeUsersRepository;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {

  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUserRepository = new FakeUsersRepository();

    updateProfile = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider
    );
  });

  it('Should be able to update the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'Joao Teste',
      email: 'joao@test.com',
      password: '123456'
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Joao Teste NEW',
      email: 'joaoNEW@test.com',
    });

    expect(updatedUser.name).toBe('Joao Teste NEW');
    expect(updatedUser.email).toBe('joaoNEW@test.com');
  });

  it('Should not be able to change to another user email', async () => {
    await fakeUserRepository.create({
      name: 'Joao Teste',
      email: 'joao@test.com',
      password: '123456'
    });

    const user = await fakeUserRepository.create({
      name: 'Test',
      email: 'test@test.com',
      password: '123456'
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Joao Teste',
        email: 'joao@test.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to update the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Joao Teste',
      email: 'joao@test.com',
      password: '123456'
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Joao Teste NEW',
      email: 'joaoNEW@test.com',
      old_password: '123456',
      password: '123123'
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('Should not be able to update the password without old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Joao Teste',
      email: 'joao@test.com',
      password: '123456'
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Joao Teste NEW',
      email: 'joaoNEW@test.com',
      password: '123123'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to update the password with wrong password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Joao Teste',
      email: 'joao@test.com',
      password: '123456'
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Joao Teste NEW',
      email: 'joaoNEW@test.com',
      old_password: 'SENHA_ERRADA',
      password: '123123'
    })).rejects.toBeInstanceOf(AppError);
  });


});
