import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheck,
  faCircleInfo,
  faCircleXmark,
  faTriangleExclamation,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { NotificationType } from '../../services/notification-service';

@Component({
  selector: 'app-notification',
  imports: [FontAwesomeModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification {
  @Input() text: string = '';
  @Input() icon: any = null;
  @Input() type: NotificationType = 'info';
  @Output() close = new EventEmitter<void>();

  faXmark = faXmark;

  get containerClasses(): string {
    const map: Record<NotificationType, string> = {
      success: 'border-green-500 bg-green-50 text-green-700',
      error: 'border-red-500 bg-red-50 text-red-700',
      warning: 'border-yellow-400 bg-yellow-50 text-yellow-700',
      info: 'border-blue-500 bg-blue-50 text-blue-700',
      neutral: 'border-gray-300 bg-white text-gray-700',
    };
    return map[this.type];
  }

  get resolvedIcon(): any {
    if (this.icon) return this.icon;
    const iconMap: Record<NotificationType, any> = {
      success: faCheck,
      error: faCircleXmark,
      warning: faTriangleExclamation,
      info: faCircleInfo,
      neutral: faCircleInfo,
    };
    return iconMap[this.type];
  }
}