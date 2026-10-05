import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

public http = inject(HttpClient);

  login(email: string, password: string) {
    return this.http.post('http://localhost:8000/api/login', { email, password });
  }
}
