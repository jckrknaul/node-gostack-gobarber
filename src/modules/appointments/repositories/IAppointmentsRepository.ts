import Appointment from '../infra/typeorm/entities/Appointments';
import iCreateAppointmentDTOP from '../dtos/ICreateAppointmentDTO';

export default interface IAppointmentRepository {
  create(data: iCreateAppointmentDTOP): Promise<Appointment>;

  findByDate(date: Date): Promise<Appointment | undefined>;

}
