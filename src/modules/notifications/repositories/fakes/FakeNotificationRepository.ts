import { ObjectID } from 'mongodb';

import Notification from '../../infra/typeorm/schemas/Notification';

import ICreateNotificationsDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

class NotificationRepository implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async create({ content, recipient_id }: ICreateNotificationsDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, {id: new ObjectID(), content, recipient_id });

    this.notifications.push(notification);

    return notification;
  }
}

export default NotificationRepository;
