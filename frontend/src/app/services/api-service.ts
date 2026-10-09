import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  public http = inject(HttpClient);

  // Cache map para armazenar as requisições GET por URL
  private cacheMap = new Map<string, Observable<any>>();

  login(email: string, password: string) {
    return this.http.post('http://localhost:8000/api/login', { email, password }).pipe(
      map(response => {
        this.clearTasksCache();
        return response;
      })
    );
  }

  signUp(name: string, email: string, password: string) {
    return this.http.post('http://localhost:8000/api/users', { name, email, password });
  }

  getTasks(page: number, perPage: number, sortField?: string, sortOrder?: string, filters?: any): Observable<any> {
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

    const url = `http://localhost:8000/api/tasks${params}`;

    // Verificar se a requisição já está em cache
    if (!this.cacheMap.has(url)) {
      const request$ = this.http.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).pipe(
        // shareReplay(1) faz cache da resposta e compartilha entre os subscribers
        shareReplay(1)
      );
      this.cacheMap.set(url, request$);
    }

    return this.cacheMap.get(url)!;
  }

  createTask(task: any) {
    return this.http.post('http://localhost:8000/api/tasks', task, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(
      map(response => {
        this.clearTasksCache();
        return response;
      })
    );
  }

  updateTask(task: any) {
    return this.http.put(`http://localhost:8000/api/tasks/${task.id}`, task, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(
      map(response => {
        this.clearTasksCache();
        return response;
      })
    );
  }

  deleteTask(id: number) {
    return this.http.delete(`http://localhost:8000/api/tasks/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(
      map(response => {
        this.clearTasksCache(); 
        return response;
      })
    );
  }

  // Método para limpar o cache de tarefas
  private clearTasksCache(): void {
    // Remover todas as URLs que contenham 'tasks' do cache
    this.cacheMap.forEach((_: Observable<any>, key: string) => {
      if (key.includes('/api/tasks')) {
        this.cacheMap.delete(key);
      }
    });
  }
}
