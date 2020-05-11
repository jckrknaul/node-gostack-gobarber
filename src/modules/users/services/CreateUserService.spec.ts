import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashRepository from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

import AppError from '@shared/errors/AppError';

  let fakeUserRepository: FakeUserRepository;
  let fakeHashRepository: FakeHashRepository;
  let createUserService: CreateUserService;

describe('CreateUser', () => {

  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashRepository = new FakeHashRepository();
    createUserService = new CreateUserService(fakeUserRepository, fakeHashRepository);
  });


  it('Should be able to create a new user', async () => {

    const user = await createUserService.execute({
      name: 'Teste 001',
      email: 'teste@test.com.br',
      password: '123456'
    });

    expect(user).toHaveProperty('id');
  });

  it('Should be have a mistake with the same email', async () => {
    const user = await createUserService.execute({
      name: 'Teste 001',
      email: 'teste@test.com.br',
      password: '123456'
    });

    await expect(createUserService.execute({
      name: 'Teste 002',
      email: 'teste@test.com.br',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError);
  });

});
