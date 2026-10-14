import { Component, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api-service';
import { Modal } from '../../ui/modal/modal';
import { Button } from '../../ui/button/button';
import { NotificationService } from '../../services/notification-service';
import { TablePrime } from '../../ui/table-prime/table-prime';
import { DrawerModule } from 'primeng/drawer';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TablePrime, Modal, Button, DrawerModule, ChartModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  isModalOpen = signal<boolean>(false);
  selectedTask = signal<any>(null);
  mode = signal<'edit' | 'view' | 'add'>('view');

  public apiService = inject(ApiService);
  private notificationService = inject(NotificationService);

  tablePrime = viewChild.required(TablePrime);

  isDrawerOpen: boolean = false;
  stats = signal<any>([]);
  rawStats = signal<any>(null); // Armazenar os dados brutos da API
  
  chartOptions = {
    responsive: true,
    maintainAspectRatio: true
  };

  openModal(task: any, mode: 'edit' | 'view' | 'add') {
    this.selectedTask.set(task);
    this.isModalOpen.set(true);
    this.mode.set(mode);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedTask.set(null);
  }

  saveTask(updatedTask: any) {
    this.apiService.updateTask(updatedTask).subscribe({
      next: (response: any) => {
        this.tablePrime().refreshData();
        this.notificationService.success('Tarefa atualizada com sucesso!');
        this.closeModal();
      },
      error: (err: any) => {
        console.log(err);
        this.notificationService.error('Erro ao atualizar tarefa.');
      }
    });
  }

  addTask(newTask: any) {
    this.apiService.createTask(newTask).subscribe({
      next: (response: any) => {
        this.tablePrime().refreshData();
        this.notificationService.success('Tarefa criada com sucesso!');
        this.closeModal();
      },
      error: (err: any) => {
        console.log(err);
        this.notificationService.error('Erro ao criar tarefa.');
      }
    });
  }

  deleteTask(taskId: number) {
    this.apiService.deleteTask(taskId).subscribe({
      next: (response: any) => {
        this.tablePrime().refreshData();
        this.notificationService.success('Tarefa excluída com sucesso!');
        this.closeModal();
      },
      error: (err: any) => {
        console.log(err);
        this.notificationService.error('Erro ao excluir tarefa.');
      }
    });
  }

  onDrawerShow() {
    // Trigger chart resize after drawer animation completes
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

  getStats() {
    this.apiService.getStats().subscribe({
      next: (res: any) => {
        console.log(res)
        const statsData = res[0]; // res é um array
        fetch('http://127.0.0.1:7709/ingest/73163a38-a118-4c52-80c8-b7eb04199b49',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'96dcc2'},body:JSON.stringify({sessionId:'96dcc2',location:'home.ts:86',message:'statsData extracted',data:{statsDataExists:!!statsData,statsData:statsData,tarefasPendentes:statsData?.tarefas_pendentes,tarefasEmAndamento:statsData?.tarefas_em_andamento,tarefasConcluidas:statsData?.tarefas_concluidas},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
        // #endregion

        const chartData = {
          labels: ['Pendentes', 'Em Andamento', 'Concluídas'],
          datasets: [{
            data: [
              statsData.tarefas_pendentes,
              statsData.tarefas_em_andamento,
              statsData.tarefas_concluidas
            ],
            backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0']
          }]
        };

        this.rawStats.set(statsData); // Armazenar dados brutos
        this.isDrawerOpen = true;
        this.stats.set(chartData);
      },
      error: (err: any) => {
        this.notificationService.error(err)
      }
    })
  }
}
