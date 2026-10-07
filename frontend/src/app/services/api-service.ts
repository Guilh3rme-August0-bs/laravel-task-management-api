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

  getTasks(page: number, perPage: number, sortField?: string, sortOrder?: string) {
    let params = `?page=${page}&per_page=${perPage}`;
    if (sortField && sortOrder) {
      params += `&sort_by=${sortField}&sort_order=${sortOrder}`;
    }
    return this.http.get(`http://localhost:8000/api/tasks${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  createTask(task: any) {
    return this.http.post('http://localhost:8000/api/tasks', task, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  updateTask(task: any) {
    return this.http.put(`http://localhost:8000/api/tasks/${task.id}`, task, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  deleteTask(id: number) {
    return this.http.delete(`http://localhost:8000/api/tasks/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}
