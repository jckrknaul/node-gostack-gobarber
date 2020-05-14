import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();
const forgotController = new ForgotPasswordController();
const resetController = new ResetPasswordController();

passwordRouter.post('/forgot', celebrate({
  [Segments.BODY]: {
    email: Joi.string().required(),
  }
}), forgotController.create);

passwordRouter.post('/reset', celebrate({
  [Segments.BODY]: {
    password: Joi.string().required(),
    password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    token: Joi.string().required()
  },
}), resetController.create);

export default passwordRouter;
