import { Component, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Button } from '../button/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ApiService } from '../../services/api-service';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-table-prime',
  imports: [
    Button,
    DatePipe, 
    TableModule, 
    FormsModule, 
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TagModule,
    SelectModule,
    DatePickerModule
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
  
  // Opções para os selects
  statusOptions = [
    { label: 'Pendente', value: 'PENDENTE' },
    { label: 'Em Andamento', value: 'EM_ANDAMENTO' },
    { label: 'Concluída', value: 'CONCLUIDA' }
  ];
  
  prioridadeOptions = [
    { label: 'Baixa', value: 'BAIXA' },
    { label: 'Média', value: 'MEDIA' },
    { label: 'Alta', value: 'ALTA' }
  ];
  
  // Filtros
  filters = {
    id: '',
    tarefa: '',
    status: '',
    prioridade: '',
    criado_em: null as Date | null,
    atualizado_em: null as Date | null
  };

  private apiService = inject(ApiService);
  private notificationService = inject(NotificationService);

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.loading.set(true);
    
    // Preparar filtros apenas com valores preenchidos
    const activeFilters: any = {};
    if (this.filters.id) activeFilters.id = this.filters.id;
    if (this.filters.tarefa) activeFilters.tarefa = this.filters.tarefa;
    if (this.filters.status) activeFilters.status = this.filters.status;
    if (this.filters.prioridade) activeFilters.prioridade = this.filters.prioridade;
    if (this.filters.criado_em) {
      activeFilters.criado_em = this.formatDateToBackend(this.filters.criado_em);
    }
    if (this.filters.atualizado_em) {
      activeFilters.atualizado_em = this.formatDateToBackend(this.filters.atualizado_em);
    }
    
    this.apiService.getTasks(
      this.page(), 
      this.per_page(), 
      this.sort_field(), 
      this.sort_order(),
      Object.keys(activeFilters).length > 0 ? activeFilters : undefined
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
  
  formatDateToBackend(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  applyFilters() {
    // Resetar para primeira página ao aplicar filtros
    this.page.set(1);
    this.loadTasks();
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
  
  clear(table: any) {
    table.clear();
    // Limpar todos os filtros
    this.filters = {
      id: '',
      tarefa: '',
      status: '',
      prioridade: '',
      criado_em: null,
      atualizado_em: null
    };
    // Resetar ordenação
    this.sort_field.set(undefined);
    this.sort_order.set(undefined);
    // Resetar página e recarregar
    this.page.set(1);
    this.loadTasks();
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
