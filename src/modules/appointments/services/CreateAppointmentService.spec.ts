import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
  it('Should be able to create a new appointment', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointmentService = new CreateAppointmentService(fakeAppointmentRepository);

    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '123456789',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456789');

  });

  it('Should be able throw exception with duplicate dates', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointmentService = new CreateAppointmentService(fakeAppointmentRepository);

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

