import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../button/button';
import { ApiService } from '../../services/api-service';
import { ConfirmModal } from '../confirm-modal/confirm-modal';

@Component({
  selector: 'app-modal',
  imports: [FormsModule, Button, ConfirmModal],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  @Input() isOpen: boolean = false;
  @Input() task: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();

  apiService = inject(ApiService);  

  editMode: boolean = false;
  isConfirmDeleteOpen: boolean = false;

  taskName: string = '';
  taskStatus: string = '';
  taskPriority: string = '';
  taskDescription: string = '';

  ngOnChanges() {
    if (this.task) {
      this.taskName = this.task.tarefa || '';
      this.taskStatus = this.task.status || '';
      this.taskPriority = this.task.prioridade || '';
      this.taskDescription = this.task.descricao || '';
      this.editMode = false;
    }
  }

  closeModal() {
    this.close.emit();
    this.editMode = false;
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.taskName = this.task.tarefa || '';
      this.taskStatus = this.task.status || '';
      this.taskPriority = this.task.prioridade || '';
      this.taskDescription = this.task.descricao || '';
    }
  }

  deleteTask() {
    this.isConfirmDeleteOpen = true;
  }

  confirmDelete() {
    this.delete.emit(this.task.id);
    console.log(this.task.id);
    this.editMode = false;
    this.isConfirmDeleteOpen = false;
  }

  cancelDelete() {
    this.isConfirmDeleteOpen = false;
  }

  saveChanges() {
    const updatedTask = {
      ...this.task,
      tarefa: this.taskName,
      status: this.taskStatus,
      prioridade: this.taskPriority,
      descricao: this.taskDescription
    };
    this.save.emit(updatedTask);
    this.editMode = false;
    
  }
}
