import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate} from 'date-fns';

import Appointment from '../../infra/typeorm/entities/Appointments';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindInAllMonthFromProviderDTO from '@modules/appointments/dtos/IFindInAllMonthFromProviderDTO';
import IFindInAllDayFromProviderDTO from '@modules/appointments/dtos/IFindInAllDayFromProviderDTO';

class AppointmentRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(appoint => isEqual(appoint.date, date) && provider_id === appoint.provider_id);
    return findAppointment;
  }

  public async create({ provider_id, user_id, date}: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    appointment.id = uuid();
    appointment.date = date;
    appointment.provider_id = provider_id;
    appointment.user_id = user_id;

    this.appointments.push(appointment);

    return appointment;
  }

  public async findAllInMonthFromProvider({provider_id, year, month}: IFindInAllMonthFromProviderDTO): Promise<Appointment[]>{
    const appointments = this.appointments.filter(appointment => {
      return (
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      );
    });

    return appointments;
  }

  public async findAllInDayFromProvider({provider_id, year, month, day}: IFindInAllDayFromProviderDTO): Promise<Appointment[]>{
    const appointments = this.appointments.filter(appointment => {
      return (
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      );
    });

    return appointments;
  }
}

export default AppointmentRepository;
