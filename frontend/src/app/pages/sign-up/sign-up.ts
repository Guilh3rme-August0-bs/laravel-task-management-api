import { Component, inject, signal } from '@angular/core';
import { Button } from '../../ui/button/button';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api-service';
import { Router } from '@angular/router';
import { Loading } from '../../ui/loading/loading';
import { NotificationService } from '../../services/notification-service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  imports: [Button, ReactiveFormsModule, Loading, PasswordModule, InputTextModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {

  loading = signal(false);
  apiService = inject(ApiService);
  router = inject(Router);
  notificationService = inject(NotificationService);

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  signUp() {
    if (this.form.valid) {
      this.loading.set(true);
      this.apiService.signUp(this.form.value.name as string, this.form.value.email as string, this.form.value.password as string)
        .subscribe({
          next: () => {
            this.apiService.login(this.form.value.email as string, this.form.value.password as string).subscribe({
              next: (loginRes: any) => {
                localStorage.setItem('token', loginRes.token);
                this.notificationService.success('Cadastro realizado com sucesso!');
                this.router.navigate(['/home']);
                this.loading.set(false);
              },
            });
          },
          error: (error: any) => {
            this.loading.set(false);
            
            if (error.error?.errors) {
              Object.values(error.error.errors).forEach((messages: any) => {
                messages.forEach((message: string) => {
                  this.notificationService.error(message);
                });
              });
            } else {
              this.notificationService.error(error.error?.message || 'Erro ao realizar cadastro.');
            }
          }
        })
    } else {
      this.notificationService.warning('Please fill in all fields correctly.');
    }
  }
}
