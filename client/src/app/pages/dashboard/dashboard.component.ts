import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService, DashboardData } from '../../services/portfolio.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2 style="margin-bottom: 30px;">Dashboard</h2>

      <div class="dashboard-grid">
        <div class="dashboard-card">
          <h3>Całkowita Wartość</h3>
          <div class="value">{{ formatCurrency(dashboard().currentValue) }}</div>
        </div>
        <div class="dashboard-card">
          <h3>Zainwestowana Gotówka</h3>
          <div class="value">{{ formatCurrency(dashboard().totalInvested) }}</div>
        </div>
        <div class="dashboard-card" [class.positive]="dashboard().profitLoss >= 0" [class.negative]="dashboard().profitLoss < 0">
          <h3>Zysk/Strata</h3>
          <div class="value">{{ formatCurrency(dashboard().profitLoss) }}</div>
          <div style="font-size: 14px; margin-top: 5px;">
            {{ dashboard().profitLossPercent }}%
          </div>
        </div>
        <div class="dashboard-card">
          <h3>Wpłaty</h3>
          <div class="value">{{ formatCurrency(dashboard().totalDeposits) }}</div>
        </div>
        <div class="dashboard-card">
          <h3>Wypłaty</h3>
          <div class="value">{{ formatCurrency(dashboard().totalWithdrawals) }}</div>
        </div>
        <div class="dashboard-card">
          <h3>Liczba Transakcji</h3>
          <div class="value">{{ dashboard().transactionCount }}</div>
        </div>
      </div>

      <div *ngIf="loading" style="text-align: center; padding: 40px;">
        Ładowanie danych...
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  dashboard = signal<DashboardData>({
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalInvested: 0,
    currentValue: 0,
    profitLoss: 0,
    profitLossPercent: 0,
    transactionCount: 0,
  });
  loading = true;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.portfolioService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard.set(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.loading = false;
      },
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(value);
  }
}

