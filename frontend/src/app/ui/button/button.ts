import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  @Input() content: string = 'Clica em mim';
  @Output() onClick = new EventEmitter<any>();
  @Input() disabled: boolean = false;
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'success' = 'primary';

  get buttonStyle(): string {
    if (this.disabled) {
      return 'bg-gray-500 text-white px-5 py-2 rounded font-medium cursor-not-allowed opacity-50';
    }

    const variants = {
      primary: 'bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded font-medium transition-colors cursor-pointer',
      secondary: 'bg-slate-600 hover:bg-slate-700 text-white px-5 py-2 rounded font-medium transition-colors cursor-pointer',
      danger: 'bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded font-medium transition-colors cursor-pointer',
      success: 'bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded font-medium transition-colors cursor-pointer'
    };

    return variants[this.variant];
  }
}
