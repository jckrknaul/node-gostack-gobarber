import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import multer from 'multer';
import uploadConfig from '@config/upload';

import ensureAuthenticate from '../middlewares/ensureAuthenticated';
import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();
const upload = multer(uploadConfig.multer);
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.post('/', celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
}), usersController.create);

usersRouter.patch(
  '/avatar',
  ensureAuthenticate,
  upload.single('avatar'),
  userAvatarController.update
);

export default usersRouter;
