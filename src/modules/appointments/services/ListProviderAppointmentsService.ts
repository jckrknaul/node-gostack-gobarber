import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';
import Appointment from '../infra/typeorm/entities/Appointments';

import IAppointmentRepository from '../repositories/IAppointmentsRepository';

interface RequestDTO {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}


@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository
  ){}

  public async execute({ provider_id, year, month, day }: RequestDTO): Promise<Appointment[]> {
    const appointmens = await this.appointmentsRepository.findAllInDayFromProvider({
      provider_id,
      year,
      month,
      day
    });

    return appointmens;
  }
}

export default ListProviderAppointmentsService;
