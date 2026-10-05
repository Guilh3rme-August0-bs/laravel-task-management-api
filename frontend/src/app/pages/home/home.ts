import { Component, inject, signal, OnInit } from '@angular/core';
import { Table } from '../../ui/table/table';
import { ApiService } from '../../services/api-service';
import { Modal } from '../../ui/modal/modal';
import { Button } from '../../ui/button/button';

@Component({
  selector: 'app-home',
  imports: [Table, Modal, Button],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  data = signal<any[]>([]);
  isModalOpen = signal<boolean>(false);
  selectedTask = signal<any>(null);
  mode = signal<'edit' | 'view' | 'add'>('view');
  public apiService = inject(ApiService);
  
  ngOnInit() {
    this.apiService.getTasks().subscribe({
      next: (res: any) => {
        this.data.set(res["tarefas:"].data);
        console.log(this.data());
      },
      error: (err: any) => {
        console.log(err);
      }
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
    console.log('Tarefa atualizada:', updatedTask);
    this.apiService.updateTask(updatedTask).subscribe((response: any) => {
      console.log(response);
      this.data.update(tasks => 
        tasks.map(task => task.id === updatedTask.id ? updatedTask : task)
      );
      this.closeModal();
    });
  }

  addTask(newTask: any) {
    console.log('Nova tarefa:', newTask);
    this.apiService.createTask(newTask).subscribe((response: any) => {
      const createdTask = response.nova_tarefa;
      this.data.update(tasks => [...tasks, createdTask]);
      this.closeModal();
    });
  }

  deleteTask(taskId: number) {
    this.apiService.deleteTask(taskId).subscribe((response: any) => {
      console.log(response);
      this.data.update(tasks => tasks.filter(task => task.id !== taskId));
      this.closeModal();
    });
  }
}
