import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointments';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

interface IRequestDTO {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {

  private appointmentRepository: IAppointmentRepository;
  private notificationRepository: INotificationsRepository;

  constructor(@inject('AppointmentsRepository') appointmentRepository: IAppointmentRepository,
              @inject('NotificationsRepository') notificationRepository: INotificationsRepository){
    this.appointmentRepository = appointmentRepository;
    this.notificationRepository = notificationRepository;
  };

  public async execute({ provider_id, user_id, date }: IRequestDTO): Promise<Appointment> {

    const appointDate = startOfHour(date);

    if (isBefore(appointDate, Date.now())) {
      throw new AppError('Não é permitido criar um apontamento para datas passadas!');
    }

    if (user_id === provider_id) {
      throw new AppError('Não é permitido criar um agendamento para si mesmo!');
    }

    if (getHours(appointDate) < 8 || getHours(appointDate) > 17) {
      throw new AppError('Não é permitido criar um apontamento para horarios fora das 08:00 e 17:00!');
    }

    const findAppointment = await this.appointmentRepository.findByDate(
      appointDate,
    );

    if (findAppointment) {
      throw new AppError('This appointment is already broked!');
    }

    const appointment = await this.appointmentRepository.create({
      provider_id,
      user_id,
      date: appointDate,
    });

    const dateFormat = format(appointDate, "dd/MM/yyyy 'às' HH:mm'h'");
    await this.notificationRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormat}`
    });

    return appointment;
  }
}

export default CreateAppointmentService;
