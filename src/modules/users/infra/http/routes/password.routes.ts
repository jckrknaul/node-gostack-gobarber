import { Router } from 'express';

import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();
const forgotController = new ForgotPasswordController();
const resetController = new ResetPasswordController();

passwordRouter.post('/forgot', forgotController.create);
passwordRouter.post('/reset', resetController.create);

export default passwordRouter;
