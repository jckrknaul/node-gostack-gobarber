import { getRepository, Repository, Raw} from 'typeorm';
import Appointment from '../entities/Appointments';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindInAllMonthFromProviderDTO from '@modules/appointments/dtos/IFindInAllMonthFromProviderDTO';
import IFindInAllDayFromProviderDTO from '@modules/appointments/dtos/IFindInAllDayFromProviderDTO';

class AppointmentRepository implements IAppointmentsRepository {

  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date },
    });

    return findAppointment;
  }

  public async findAllInMonthFromProvider({provider_id, year, month}: IFindInAllMonthFromProviderDTO): Promise<Appointment[]>{
    const parseMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName => `to_char(${dateFieldName}, 'MM-YYYYY') = '${parseMonth}-${year}'`),
      }
    });

    return appointments;
  }

  public async findAllInDayFromProvider({provider_id, year, month, day}: IFindInAllDayFromProviderDTO): Promise<Appointment[]>{
    const parseDay = String(day).padStart(2, '0');
    const parseMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName => `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parseDay}-${parseMonth}-${year}'`),
      }
    });

    return appointments;
  }

  public async create({ provider_id, user_id, date}: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({provider_id, user_id, date});

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentRepository;
