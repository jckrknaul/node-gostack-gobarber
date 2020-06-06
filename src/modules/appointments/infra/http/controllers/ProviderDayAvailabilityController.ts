import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year, day} = request.query;

    const listProviderService = container.resolve(ListProviderDayAvailabilityService);

    const availability = await listProviderService.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
      day: Number(day)
    });

    return response.json(availability);
  }
}
