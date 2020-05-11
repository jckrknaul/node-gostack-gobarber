import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

import AppError from '@shared/errors/AppError';

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointmentService: CreateAppointmentService;


describe('CreateAppointment', () => {

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    createAppointmentService = new CreateAppointmentService(fakeAppointmentRepository);
  });


  it('Should be able to create a new appointment', async () => {

    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '123456789',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456789');

  });

  it('Should be able throw exception with duplicate dates', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    const appointment = await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '123456789',
    });

    expect(createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '123456789',
    })).rejects.toBeInstanceOf(AppError);
  });
});

