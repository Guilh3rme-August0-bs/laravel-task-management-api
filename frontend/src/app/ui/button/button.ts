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

  disabledStyle = 'bg-gray-500 text-white p-2 rounded-sm cursor-not-allowed';
  enabledStyle = 'bg-blue-500 text-white p-2 rounded-sm cursor-pointer';
}
