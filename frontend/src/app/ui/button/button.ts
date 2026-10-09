import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-button',
  imports: [ButtonModule],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  @Input() content: string = 'Clica em mim';
  @Output() onClick = new EventEmitter<any>();
  @Input() disabled: boolean = false;
  @Input() severity: 'primary' | 'secondary' | 'danger' | 'success' | 'info' | 'help' | 'contrast' = 'primary';
  @Input() icon: string = '';
}
