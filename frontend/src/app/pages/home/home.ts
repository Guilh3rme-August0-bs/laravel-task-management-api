import { Component, inject, signal, OnInit, SimpleChanges, computed } from '@angular/core';
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

  page = signal<number>(1);
  per_page = signal<number>(10);
  
  ngOnInit() {
    this.apiService.getTasks(this.page(), this.per_page()).subscribe({
      next: (res: any) => {
        this.data.set(res['tarefas:'].data);
        this.lastPage.set(res['tarefas:'].last_page);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  prevDisabled = computed(() => this.page() > 1 ? false : true);
  lastPage = signal<number>(0);
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
      },
    });
  }

  previousPage() {
    this.page.set(this.page() - 1);
    this.apiService.getTasks(this.page(), this.per_page()).subscribe({
      next: (res: any) => {
        this.data.set(res['tarefas:'].data);
        this.lastPage.set(res['tarefas:'].last_page);
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
    this.apiService.updateTask(updatedTask).subscribe((response: any) => {
      this.data.update((tasks) =>
        tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
      );
      this.closeModal();
    });
  }

  addTask(newTask: any) {
    this.apiService.createTask(newTask).subscribe((response: any) => {
      const createdTask = response.nova_tarefa;
      this.data.update((tasks) => [...tasks, createdTask]);
      this.closeModal();
    });
  }

  deleteTask(taskId: number) {
    this.apiService.deleteTask(taskId).subscribe((response: any) => {
      this.data.update((tasks) => tasks.filter((task) => task.id !== taskId));
      this.closeModal();
    });
  }
}
