import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Notification } from './ui/notification/notification';
import { NotificationService } from './services/notification-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Notification],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  protected readonly notificationService = inject(NotificationService);

  onDismiss(id: number) {
    this.notificationService.dismiss(id);
  }
}