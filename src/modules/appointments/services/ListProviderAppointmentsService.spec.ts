import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

//import AppError from '@shared/errors/AppError';

let fakeAppointmentRepository: FakeAppointmentRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderMonthAvailability', () => {

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointmentsService = new ListProviderAppointmentsService(fakeAppointmentRepository, fakeCacheProvider);
  });

  it('Should be able to list appointments on a specific day', async () => {

    const appointment1 = await fakeAppointmentRepository.create({
      provider_id: 'qualquer',
      user_id: 'sahshhas',
      date: new Date(2020, 4, 20, 14, 0, 0)
    });

    const appointment2 = await fakeAppointmentRepository.create({
      provider_id: 'qualquer',
      user_id: 'sahshhas',
      date: new Date(2020, 4, 20, 15, 0, 0)
    });

    const appoinmtments = await listProviderAppointmentsService.execute({
      provider_id: 'qualquer',
      year: 2020,
      month: 5,
      day: 20
    });

    expect(appoinmtments).toEqual([appointment1, appointment2]);
  });

});
