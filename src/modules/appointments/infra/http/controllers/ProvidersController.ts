import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProviderService from '@modules/appointments/services/ListProvidersService';

export default class AppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listProviderService = container.resolve(ListProviderService);

    const providers = await listProviderService.execute({
      user_id,
    });

    return response.json(classToClass(providers));
  }
}
