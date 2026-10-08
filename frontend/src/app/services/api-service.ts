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

  signUp(name: string, email: string, password: string) {
    return this.http.post('http://localhost:8000/api/users', { name, email, password });
  }

  getTasks(page: number, perPage: number, sortField?: string, sortOrder?: string, filters?: any) {
    let params = `?page=${page}&per_page=${perPage}`;
    if (sortField && sortOrder) {
      params += `&sort_by=${sortField}&sort_order=${sortOrder}`;
    }
    if (filters) {
      if (filters.id) params += `&filter_id=${filters.id}`;
      if (filters.tarefa) params += `&filter_tarefa=${filters.tarefa}`;
      if (filters.status) params += `&filter_status=${filters.status}`;
      if (filters.prioridade) params += `&filter_prioridade=${filters.prioridade}`;
      if (filters.criado_em) params += `&filter_criado_em=${filters.criado_em}`;
      if (filters.atualizado_em) params += `&filter_atualizado_em=${filters.atualizado_em}`;
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
