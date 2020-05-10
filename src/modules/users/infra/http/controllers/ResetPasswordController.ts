import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';

export default class ResetController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { password, token } = request.body;

    const resetForgotPassEmail = container.resolve(ResetPasswordService);

    await resetForgotPassEmail.execute({
      password,
      token
    });

    return response.status(204).json();
  }
}
