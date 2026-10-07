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
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loading = signal(false);
  apiService = inject(ApiService);
  router = inject(Router);
  notificationService = inject(NotificationService);
  
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  login() {
   if (this.form.valid) {
     this.loading.set(true);
     this.apiService.login(this.form.value.email as string, this.form.value.password as string)
     .subscribe({
       next: (res: any) => {
          localStorage.setItem('token', res.token);
          this.notificationService.success('Login realizado com sucesso!');
          this.router.navigate(['/home']);
        },
        error: () => {
          this.notificationService.error('Erro ao fazer login. Verifique suas credenciais.');
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
        },
      })
   } else {
     this.notificationService.warning('Por favor, preencha todos os campos corretamente.');
    }
  }
}
