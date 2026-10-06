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
  @Input() mode: 'view' | 'edit' | 'add' = 'view';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Output() add = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();

  apiService = inject(ApiService);  

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
    } else if (this.mode === 'add') {
      // Limpar campos para adicionar nova tarefa
      this.taskName = '';
      this.taskStatus = 'PENDENTE';
      this.taskPriority = 'MEDIA';
      this.taskDescription = '';
    }
  }

  closeModal() {
    this.close.emit();
    this.mode === 'add' 
    ? this.mode = 'add' 
    : this.mode = 'view';
  }

  deleteTask() {
    this.isConfirmDeleteOpen = true;
  }

  changeMode(newMode: 'view' | 'edit' | 'add') {
    this.mode = newMode;
    if (newMode === 'view' && this.task) {
      // Restaurar valores originais ao cancelar edição
      this.taskName = this.task.tarefa || '';
      this.taskStatus = this.task.status || '';
      this.taskPriority = this.task.prioridade || '';
      this.taskDescription = this.task.descricao || '';
    }
  }

  confirmDelete() {
    this.delete.emit(this.task.id);
    console.log(this.task.id);
    this.isConfirmDeleteOpen = false;
  }

  cancelDelete() {
    this.isConfirmDeleteOpen = false;
  }

  saveChanges() {
    const alterationData = {
      tarefa: this.taskName,
      status: this.taskStatus,
      prioridade: this.taskPriority,
      descricao: this.taskDescription
    };
    
    if (this.mode === 'add') {
      this.add.emit(alterationData);
    } else if (this.mode === 'edit') {
      const updatedTask = {
        ...this.task,
        ...alterationData
      };
      this.save.emit(updatedTask);
    }
  }
}
