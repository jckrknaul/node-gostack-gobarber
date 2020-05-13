import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailability from './ListProviderDayAvailabilityService';

//import AppError from '@shared/errors/AppError';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProviderdayAvailability: ListProviderDayAvailability;

describe('ListProviderMonthAvailability', () => {

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderdayAvailability = new ListProviderDayAvailability(fakeAppointmentRepository);
  });

  it('Should be able to list the day availability from provider', async () => {

    await fakeAppointmentRepository.create({
      provider_id: 'qualquer',
      user_id: 'qualquer',
      date: new Date(2020, 4, 20, 14, 0, 0)
    });

    await fakeAppointmentRepository.create({
      provider_id: 'qualquer',
      user_id: 'qualquer',
      date: new Date(2020, 4, 20, 15, 0, 0)
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });

    const availability = await listProviderdayAvailability.execute({
      provider_id: 'qualquer',
      year: 2020,
      month: 5,
      day: 20
    });

    expect(availability).toEqual(expect.arrayContaining([
      { hour: 8, available: false},
      { hour: 9, available: false},
      { hour: 10, available: false},
      { hour: 11, available: false},
      { hour: 12, available: true},
      { hour: 13, available: true},
      { hour: 14, available: false},
      { hour: 15, available: false},
    ]));
  });

});
