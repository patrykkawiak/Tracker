import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsService, Log } from '../../services/logs.service';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2 style="margin-bottom: 20px;">Logi Systemu</h2>

      <div *ngIf="error()" class="card" style="background-color: #fee; border: 1px solid #fcc; margin-bottom: 20px; padding: 15px;">
        <strong>Błąd:</strong> {{ error() }}
        <button (click)="loadLogs()" style="margin-left: 10px; padding: 5px 10px;">Spróbuj ponownie</button>
      </div>

      <div *ngIf="loading()" class="card" style="text-align: center; padding: 40px;">
        Ładowanie logów...
      </div>

      <div *ngIf="!loading() && !error()" class="card">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Akcja</th>
              <th>Szczegóły</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let log of logs()">
              <td>{{ formatDate(log.timestamp) }}</td>
              <td>{{ log.action }}</td>
              <td>{{ formatDetails(log.details) }}</td>
            </tr>
            <tr *ngIf="logs().length === 0">
              <td colspan="3" style="text-align: center; padding: 40px;">
                Brak logów
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class LogsComponent implements OnInit {
  logs = signal<Log[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private logsService: LogsService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading.set(true);
    this.error.set(null);
    this.logsService.getLogs().subscribe({
      next: (data) => {
        this.logs.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading logs:', err);
        const errorMessage = err.error?.message || err.message || 'Nie udało się załadować logów';
        this.error.set(errorMessage);
        this.loading.set(false);
      },
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('pl-PL');
  }

  formatDetails(details: any): string {
    if (!details) return '-';
    return JSON.stringify(details);
  }
}

