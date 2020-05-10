import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointments';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {

  private appointmentRepository: IAppointmentRepository;

  constructor(@inject('AppointmentsRepository') appointmentRepository: IAppointmentRepository){
    this.appointmentRepository = appointmentRepository;
  };

  public async execute({ provider_id, date }: IRequestDTO): Promise<Appointment> {

    const appointDate = startOfHour(date);

    const findAppointment = await this.appointmentRepository.findByDate(
      appointDate,
    );

    if (findAppointment) {
      throw new AppError('This appointment is already broked!');
    }

    const appointment = await this.appointmentRepository.create({
      provider_id,
      date: appointDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
