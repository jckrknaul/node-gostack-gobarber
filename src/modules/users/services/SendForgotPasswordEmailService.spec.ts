import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    );
  });


  it('Should be able to recover the password useng the email', async () => {

    const sendEmail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Teste da Silva',
      email: 'teste@test.com.br',
      password: '123456'
    });

    await sendForgotPasswordEmailService.execute({
      email: 'teste@test.com.br',
    });

    expect(sendEmail).toHaveBeenCalled();
  });


  it('Should not be able to recover a non-existing user password', async () => {

    const sendEmail = jest.spyOn(fakeMailProvider, 'sendMail');

    await expect(sendForgotPasswordEmailService.execute({
      email: 'teste@test.com.br',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should generate a forgot password token', async () => {

    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Teste da Silva',
      email: 'teste@test.com.br',
      password: '123456'
    });

    await sendForgotPasswordEmailService.execute({
      email: 'teste@test.com.br',
    });

    await expect(generateToken).toHaveBeenCalledWith(user.id);
  });


});
