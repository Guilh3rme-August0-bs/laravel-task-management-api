import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-loading',
  imports: [FontAwesomeModule],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading {
  faSpinner = faSpinner;

  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() color: string = 'text-gray-900';
  @Input() message: string = '';

  get iconClasses(): string {
    const sizeClass =
      this.size === 'sm' ? 'text-2xl' : this.size === 'lg' ? 'text-7xl' : 'text-5xl';
    return `${sizeClass} ${this.color} animate-spin`;
  }
}