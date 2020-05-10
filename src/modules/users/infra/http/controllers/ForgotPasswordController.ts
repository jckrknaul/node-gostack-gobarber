import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPassEmailService from '@modules/users/services/SendForgotPasswordEmailService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const SendForgotPassEmail = container.resolve(SendForgotPassEmailService);

    await SendForgotPassEmail.execute({
      email,
    });

    return response.status(204).json();
  }
}
