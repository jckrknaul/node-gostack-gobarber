import Appointment from '../infra/typeorm/entities/Appointments';
import iCreateAppointmentDTOP from '../dtos/ICreateAppointmentDTO';
import IFindAllMonthFromProvider from '../dtos/IFindInAllMonthFromProviderDTO';
import IFindAllDayFromProvider from '../dtos/IFindInAllDayFromProviderDTO';

export default interface IAppointmentRepository {
  create(data: iCreateAppointmentDTOP): Promise<Appointment>;
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(data: IFindAllMonthFromProvider): Promise<Appointment[]>;
  findAllInDayFromProvider(data: IFindAllDayFromProvider): Promise<Appointment[]>;
}
