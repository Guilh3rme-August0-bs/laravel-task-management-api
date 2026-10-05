import { Component, inject } from '@angular/core';
import { Button } from '../../ui/button/button';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [Button, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  apiService = inject(ApiService);
  router = inject(Router);
  
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  login() {
   if (this.form.valid) {
    this.apiService.login(this.form.value.email as string, this.form.value.password as string)
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/home']);
        },
        error: () => alert('Erro ao fazer login')
      })
   } else {
    alert('Formulário inválido');
   }
  }
}
