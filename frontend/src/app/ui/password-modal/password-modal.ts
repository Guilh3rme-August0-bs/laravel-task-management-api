import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { Button } from '../button/button';
import { Password } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api-service';
@Component({
  selector: 'app-password-modal',
  imports: [Button, Password, FormsModule],
  templateUrl: './password-modal.html',
  styleUrl: './password-modal.css',
})
export class PasswordModal {

  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() usernameChanged = new EventEmitter<void>();

  password = signal<string>('');
  newUsername = signal<string>('');

  apiService = inject(ApiService);

  changeUsername(): void {
    this.apiService.changeUsername(this.newUsername(), this.password()).subscribe({
      next: (response) => {
        console.log(response);
        this.usernameChanged.emit();
        this.close.emit();
        this.isOpen = false;
      },
      error: (error) => {
        console.log(error);
        this.close.emit();
        alert(error.error.message);
        this.isOpen = false;
      }
    });
  }

  onCancel(): void {
    this.close.emit();
  }

  onConfirm(): void {
    this.close.emit();
  }
}