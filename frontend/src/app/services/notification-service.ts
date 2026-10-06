import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'neutral';

export interface NotificationItem {
  id: number;
  text: string;
  icon?: any;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notifications = signal<NotificationItem[]>([]);
  private nextId = 1;
  private readonly autoDismissMs = 4000;

  success(text: string, icon?: any) {
    this.push(text, icon, 'success');
  }

  error(text: string, icon?: any) {
    this.push(text, icon, 'error');
  }

  warning(text: string, icon?: any) {
    this.push(text, icon, 'warning');
  }

  info(text: string, icon?: any) {
    this.push(text, icon, 'info');
  }

  neutral(text: string, icon?: any) {
    this.push(text, icon, 'neutral');
  }

  dismiss(id: number) {
    this.notifications.update((arr) => arr.filter((n) => n.id !== id));
  }

  private push(text: string, icon: any | undefined, type: NotificationType) {
    const id = this.nextId++;
    this.notifications.update((arr) => [...arr, { id, text, icon, type }]);
    setTimeout(() => this.dismiss(id), this.autoDismissMs);
  }
}