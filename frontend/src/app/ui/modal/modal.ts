import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../button/button';

@Component({
  selector: 'app-modal',
  imports: [FormsModule, Button],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  @Input() isOpen: boolean = false;
  @Input() task: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Output() delete = new EventEmitter<void>();

  editMode: boolean = false;

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
    this.delete.emit();
    this.editMode = false;
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
