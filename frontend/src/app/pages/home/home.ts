import { Component, inject, signal, OnInit, SimpleChanges, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Table } from '../../ui/table/table';
import { ApiService } from '../../services/api-service';
import { Modal } from '../../ui/modal/modal';
import { Button } from '../../ui/button/button';
import { Notification } from '../../ui/notification/notification';
import { NotificationService } from '../../services/notification-service';
import { TablePrime } from '../../ui/table-prime/table-prime';
import { PaginatorModule } from 'primeng/paginator';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-home',
  imports: [Table, TablePrime, Modal, Button, Notification, FormsModule, PaginatorModule, Select],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  data = signal<any[]>([]);
  isModalOpen = signal<boolean>(false);
  selectedTask = signal<any>(null);
  mode = signal<'edit' | 'view' | 'add'>('view');

  public apiService = inject(ApiService);
  private notificationService = inject(NotificationService);

  page = signal<number>(1);
  per_page = signal<number>(10);

  // PrimeNG pagination
  first2: number = 0;
  rows2: number = 10;
  options = [
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '100', value: 100 }
  ];

  onPageChange2(event: any) {
    this.first2 = event.first;
    this.rows2 = event.rows;
    const newPage = Math.floor(event.first / event.rows) + 1;
    this.page.set(newPage);
    this.per_page.set(event.rows);
    
    this.apiService.getTasks(this.page(), this.per_page()).subscribe({
      next: (res: any) => {
        this.data.set(res['tarefas:'].data);
        this.lastPage.set(res['tarefas:'].last_page);
        this.totalRecords.set(res['tarefas:'].total);
      },
      error: (err: any) => {
        console.log(err);
        this.notificationService.error('Erro ao alterar página.');
      }
    });
  }
  
  ngOnInit() {
    this.apiService.getTasks(this.page(), this.per_page()).subscribe({
      next: (res: any) => {
        this.data.set(res['tarefas:'].data);
        this.lastPage.set(res['tarefas:'].last_page);
        this.totalRecords.set(res['tarefas:'].total);
      },
      error: (err: any) => {
        console.log(err);
        this.notificationService.error('Erro ao carregar tarefas.');
      },
    });
  }

  prevDisabled = computed(() => this.page() > 1 ? false : true);
  lastPage = signal<number>(0);
  totalRecords = signal<number>(0);
  nextDisabled = computed(() => this.lastPage() === this.page() ? true : false);

  nextPage() {
    this.page.set(this.page() + 1);
    this.apiService.getTasks(this.page(), this.per_page()).subscribe({
      next: (res: any) => {
        this.data.set(res['tarefas:'].data);
        this.lastPage.set(res['tarefas:'].last_page);
      },
      error: (err: any) => {
        console.log(err);
        this.notificationService.error('Erro ao carregar próxima página.');
      },
    });
  }

  onChangePage(event: any) {
    this.per_page.set(event.target.value);
    this.page.set(1);
    this.apiService.getTasks(this.page(), this.per_page()).subscribe({
      next: (res: any) => {
        this.data.set(res['tarefas:'].data);
        this.lastPage.set(res['tarefas:'].last_page);
      },
      error: (err: any) => {
        console.log(err);
        this.notificationService.error('Erro ao alterar itens por página.');
      }
    });
  }

  previousPage() {
    this.page.set(this.page() - 1);
    this.apiService.getTasks(this.page(), this.per_page()).subscribe({
      next: (res: any) => {
        this.data.set(res['tarefas:'].data);
        this.lastPage.set(res['tarefas:'].last_page);
      },
      error: (err: any) => {
        console.log(err);
        this.notificationService.error('Erro ao carregar página anterior.');
      },
    });
  }

  openModal(task: any, mode: 'edit' | 'view' | 'add') {
    this.selectedTask.set(task);
    this.isModalOpen.set(true);
    this.mode.set(mode);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedTask.set(null);
  }

  saveTask(updatedTask: any) {
    this.apiService.updateTask(updatedTask).subscribe({
      next: (response: any) => {
        this.apiService.getTasks(this.page(), this.per_page()).subscribe({
          next: (res: any) => {
            this.data.set(res['tarefas:'].data);
            this.lastPage.set(res['tarefas:'].last_page);
          },
        });
        this.notificationService.success('Tarefa atualizada com sucesso!');
        this.closeModal();
      },
      error: (err: any) => {
        console.log(err);
        this.notificationService.error('Erro ao atualizar tarefa.');
      }
    });
  }

  addTask(newTask: any) {
    this.apiService.createTask(newTask).subscribe({
      next: (response: any) => {
        const createdTask = response.nova_tarefa;
        this.apiService.getTasks(this.page(), this.per_page()).subscribe({
          next: (res: any) => {
            this.data.set(res['tarefas:'].data);
            this.lastPage.set(res['tarefas:'].last_page);
          },
        });
        this.notificationService.success('Tarefa criada com sucesso!');
        this.closeModal();
      },
      error: (err: any) => {
        console.log(err);
        this.notificationService.error('Erro ao criar tarefa.');
      }
    });
  }

  deleteTask(taskId: number) {
    this.apiService.deleteTask(taskId).subscribe({
      next: (response: any) => {
        this.data.update((tasks) => tasks.filter((task) => task.id !== taskId));
        this.notificationService.success('Tarefa excluída com sucesso!');
        this.closeModal();
      },
      error: (err: any) => {
        console.log(err);
        this.notificationService.error('Erro ao excluir tarefa.');
      }
    });
  }
}
