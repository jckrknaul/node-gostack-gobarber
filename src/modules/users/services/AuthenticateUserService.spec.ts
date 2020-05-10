import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashRepository from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

import AppError from '@shared/errors/AppError';

describe('AuthenticateUser', () => {
  it('Should be able to authenticate a user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashRepository = new FakeHashRepository();

    const createUserService = new CreateUserService(fakeUserRepository, fakeHashRepository);
    const authUserService = new AuthenticateUserService(fakeUserRepository, fakeHashRepository);

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
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashRepository = new FakeHashRepository();

    const createUserService = new CreateUserService(fakeUserRepository, fakeHashRepository);
    const authUserService = new AuthenticateUserService(fakeUserRepository, fakeHashRepository);

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
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashRepository = new FakeHashRepository();

    const createUserService = new CreateUserService(fakeUserRepository, fakeHashRepository);
    const authUserService = new AuthenticateUserService(fakeUserRepository, fakeHashRepository);

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
