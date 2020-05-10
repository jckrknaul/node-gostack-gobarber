import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';

import Appointment from '../../infra/typeorm/entities/Appointments';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

class AppointmentRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(appoint => isEqual(appoint.date, date));
    return findAppointment;
  }

  public async create({ provider_id, date}: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    appointment.id = uuid();
    appointment.date = date;
    appointment.provider_id = provider_id;

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentRepository;
