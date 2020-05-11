import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {

  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUserRepository);
  });

  it('Should be able to show the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'Joao Teste',
      email: 'joao@test.com',
      password: '123456'
    });

    const profileUser = await showProfile.execute({
      user_id: user.id});

    expect(profileUser.name).toBe('Joao Teste');
    expect(profileUser.email).toBe('joao@test.com');
  });

});
