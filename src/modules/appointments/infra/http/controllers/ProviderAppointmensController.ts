import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { day, month, year } = request.body;

    const listProviderService = container.resolve(ListProviderAppointmentsService);

    const appointments = await listProviderService.execute({
      provider_id,
      month,
      year,
      day
    });

    return response.json(appointments);
  }
}
