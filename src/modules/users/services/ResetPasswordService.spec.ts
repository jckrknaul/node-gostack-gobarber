import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;

describe('ResetPasswordService', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    );
  });


  it('Should be able to reset the password', async () => {

    let user = await fakeUsersRepository.create({
      name: 'Teste da Silva',
      email: 'teste@test.com.br',
      password: '123456'
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      password: '123123',
      token,
    });

    const Updateduser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('123123');
    expect(Updateduser?.password).toBe('123123');
  });


  it('Should not be able to reset the password with non-existing token', async () => {

     await expect(resetPasswordService.execute({
      password: '123456',
      token: 'XPTO',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to reset the password with non-existing user', async () => {

    const { token } = await fakeUserTokensRepository.generate('XPTO');

    await expect(resetPasswordService.execute({
     password: '123456',
     token,
   })).rejects.toBeInstanceOf(AppError);
 });


 it('Should not be able to reset password if passed more than 2 hours', async () => {

  let user = await fakeUsersRepository.create({
    name: 'Teste da Silva',
    email: 'teste@test.com.br',
    password: '123456'
  });

  const { token } = await fakeUserTokensRepository.generate(user.id);

  jest.spyOn(Date, 'now').mockImplementationOnce(() => {
    const customDate = new Date();

    return customDate.setHours(customDate.getHours() + 3);
  });

  await expect(resetPasswordService.execute({
    password: '123123',
    token,
  })).rejects.toBeInstanceOf(AppError);

});

});
