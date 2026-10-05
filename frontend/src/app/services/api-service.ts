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

  getTasks() {
    return this.http.get('http://localhost:8000/api/tasks', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  createTask(task: any) {
    return this.http.post('http://localhost:8000/api/tasks', task);
  }

  updateTask(task: any) {
    return this.http.put(`http://localhost:8000/api/tasks/${task.id}`, task);
  }

  deleteTask(id: number) {
    return this.http.delete(`http://localhost:8000/api/tasks/${id}`);
  }
}
