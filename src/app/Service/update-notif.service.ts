import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notifications } from '../Model/Notification.model';

@Injectable({
  providedIn: 'root'
})
export class UpdateNotifService {
  private notificationsSource = new BehaviorSubject<Notifications[]>([]);
  notifications$ = this.notificationsSource.asObservable();

  private unseenCountSource = new BehaviorSubject<number>(0);
  unseenCount$ = this.unseenCountSource.asObservable();

  updateNotifications(notifications: Notifications[]) {
    this.notificationsSource.next(notifications);
    const unseenCount = notifications.filter(notif => !notif.seenRecipients.length).length;
    this.unseenCountSource.next(unseenCount);
  }
}