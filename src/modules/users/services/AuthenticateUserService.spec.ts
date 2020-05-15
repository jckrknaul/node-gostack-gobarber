import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashRepository from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeHashRepository: FakeHashRepository;
let fakeCacheProvider: FakeCacheProvider;
let createUserService: CreateUserService;
let authUserService: AuthenticateUserService;

describe('AuthenticateUser', () => {

  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashRepository = new FakeHashRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createUserService = new CreateUserService(fakeUserRepository, fakeHashRepository, fakeCacheProvider);
    authUserService = new AuthenticateUserService(fakeUserRepository, fakeHashRepository);
  });

  it('Should be able to authenticate a user', async () => {

    const user = await createUserService.execute({
      name: 'Teste 001',
      email: 'teste@test.com.br',
      password: '123456'
    });

    const response = await authUserService.execute({
      email: 'teste@test.com.br',
      password: '123456'
    });

    expect(response).toHaveProperty('token');
  });

  it('Should be able a Throw Error when doesnt find a valid email ', async () => {

    const user = await createUserService.execute({
      name: 'Teste 001',
      email: 'teste@test.com.br',
      password: '123456'
    });

    expect(authUserService.execute({
      email: 'invalidEmail@test.com.br',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate with wrong password', async () => {

    await createUserService.execute({
      name: 'Teste 001',
      email: 'teste@test.com.br',
      password: '123456'
    });

    expect(authUserService.execute({
      email: 'teste@test.com.br',
      password: 'IncorrectPass'
    })).rejects.toBeInstanceOf(AppError);
  });

});
