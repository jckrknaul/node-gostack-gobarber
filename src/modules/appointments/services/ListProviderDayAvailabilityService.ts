import { injectable, inject } from 'tsyringe';
//import AppError from '@shared/errors/AppError';
import { getHours, isAfter } from 'date-fns';

import IAppointmentRepository from '../repositories/IAppointmentsRepository';

interface RequestDTO {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type RsponseDTO = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository
  ){}

  public async execute({ provider_id, year, month, day }: RequestDTO): Promise<RsponseDTO> {

    const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
      provider_id,
      year,
      month,
      day
    });

    const hourStart = 8;

    const eachHourArray = Array.from({
      length: 10 },
      (_, index) => index + hourStart,
    );

    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(appointment => getHours(appointment.date) === hour)

      const compareDate = new Date(year, month-1, day, hour);

      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate)
      }
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
