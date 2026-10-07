import { Component, inject, signal, viewChild } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { Modal } from '../../ui/modal/modal';
import { Button } from '../../ui/button/button';
import { NotificationService } from '../../services/notification-service';
import { TablePrime } from '../../ui/table-prime/table-prime';

@Component({
  selector: 'app-home',
  imports: [TablePrime, Modal, Button],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  isModalOpen = signal<boolean>(false);
  selectedTask = signal<any>(null);
  mode = signal<'edit' | 'view' | 'add'>('view');

  public apiService = inject(ApiService);
  private notificationService = inject(NotificationService);

  tablePrime = viewChild.required(TablePrime);

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
        this.tablePrime().refreshData();
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
        this.tablePrime().refreshData();
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
        this.tablePrime().refreshData();
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
