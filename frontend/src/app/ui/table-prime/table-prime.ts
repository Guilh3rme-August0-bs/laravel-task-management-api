import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-table-prime',
  imports: [DatePipe, TableModule],
  templateUrl: './table-prime.html',
  styleUrl: './table-prime.css',
})
export class TablePrime {

  @Input() data : any[] = []
  @Output() rowClick = new EventEmitter<any>();

  onRowClick(task: any) {
    this.rowClick.emit(task);
  }

  colorPriority(priority: any) {
    switch (priority) {
      case 'BAIXA':
        return 'text-green-500 px-4 text-center py-2';
      case 'MEDIA':
        return 'text-yellow-500 px-4 text-center py-2';
      case 'ALTA':
        return 'text-red-500 px-4 text-center py-2';
      default:
        return 'text-gray-500 px-4 text-center py-2';
    }
  }

}
