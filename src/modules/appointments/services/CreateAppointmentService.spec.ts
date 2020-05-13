import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationRepository from '@modules/notifications/repositories/fakes/FakeNotificationRepository';
import CreateAppointmentService from './CreateAppointmentService';

import AppError from '@shared/errors/AppError';

let fakeAppointmentRepository: FakeAppointmentRepository;
let fakeNotificationRepository: FakeNotificationRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeNotificationRepository = new FakeNotificationRepository();
    createAppointmentService = new CreateAppointmentService(fakeAppointmentRepository, fakeNotificationRepository);
  });


  it('Should be able to create a new appointment', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: '123456789',
      provider_id: '324234324',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('324234324');

  });

  it('Should be able throw exception with duplicate dates', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 8).getTime();
    });

    const appointmentDate = new Date(2020, 4, 10, 11);

    const appointment = await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '123456789',
      user_id: '324234324',
    });

    expect(createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '123456789',
      user_id: '324234324',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create an appointment on a past date', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(createAppointmentService.execute({
      date: new Date(2020, 4, 10, 11),
      provider_id: '123456789',
      user_id: '321546565',
    })).rejects.toBeInstanceOf(AppError);
  });


  it('Should not be able to create an appointment with user_id and provider_id equals', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(createAppointmentService.execute({
      date: new Date(2020, 4, 10, 11),
      provider_id: '123456789',
      user_id: '123456789',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create an appointment with out hours between 08:00 and 17:00', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 10).getTime();
    });

    await expect(createAppointmentService.execute({
      date: new Date(2020, 4, 11, 7),
      provider_id: '987654321',
      user_id: '123456789',
    })).rejects.toBeInstanceOf(AppError);

    await expect(createAppointmentService.execute({
      date: new Date(2020, 4, 11, 19),
      provider_id: '987654321',
      user_id: '123456789',
    })).rejects.toBeInstanceOf(AppError);
  });
});

