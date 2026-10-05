import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-table',
  imports: [DatePipe],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {

  @Input() data : any[] = []
  @Output() rowClick = new EventEmitter<any>();

  onRowClick(task: any) {
    this.rowClick.emit(task);
  }

}
