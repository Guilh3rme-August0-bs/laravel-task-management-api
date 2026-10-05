import { Component, inject, signal, OnInit } from '@angular/core';
import { Table } from '../../ui/table/table';
import { ApiService } from '../../services/api-service';

@Component({
  selector: 'app-home',
  imports: [Table],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  data = signal<any[]>([]);
  
  public apiService = inject(ApiService);
  
  ngOnInit() {
    this.apiService.getTasks().subscribe({
      next: (res: any) => {
        this.data.set(res["tarefas:"].data);
        console.log(this.data());
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}
