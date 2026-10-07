import { Component, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ApiService } from '../../services/api-service';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-table-prime',
  imports: [
    DatePipe, 
    TableModule, 
    FormsModule, 
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TagModule
  ],
  templateUrl: './table-prime.html',
  styleUrl: './table-prime.css',
})
export class TablePrime implements OnInit {

  @Output() rowClick = new EventEmitter<any>();

  data = signal<any[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false); 
  
  page = signal<number>(1);
  per_page = signal<number>(10);
  sort_field = signal<string | undefined>(undefined);
  sort_order = signal<string | undefined>(undefined);

  private apiService = inject(ApiService);
  private notificationService = inject(NotificationService);

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.loading.set(true);
    this.apiService.getTasks(
      this.page(), 
      this.per_page(), 
      this.sort_field(), 
      this.sort_order()
    ).subscribe({
      next: (res: any) => {
        this.data.set(res['tarefas:'].data);
        this.totalRecords.set(res['tarefas:'].total);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.log(err);
        this.notificationService.error('Erro ao carregar tarefas.');
        this.loading.set(false);
      },
    });
  }

  onPageChange(event: any) {
    const newPage = Math.floor(event.first / event.rows) + 1;
    this.page.set(newPage);
    this.per_page.set(event.rows);
    
    // Captura ordenação se existir no evento
    if (event.sortField) {
      this.sort_field.set(event.sortField);
      this.sort_order.set(event.sortOrder === 1 ? 'asc' : 'desc');
    }
    
    this.loadTasks();
  }

  onRowClick(task: any) {
    this.rowClick.emit(task);
  }

  getSeverityPriority(priority: string) {
    switch (priority) {
      case 'BAIXA':
        return 'success';
      case 'MEDIA':
        return 'warn';
      case 'ALTA':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  refreshData() {
    this.loadTasks();
  }

}
