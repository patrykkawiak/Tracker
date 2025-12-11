import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'buy' | 'sell';
  assetId?: string;
  asset?: {
    id: string;
    name: string;
    ticker?: string;
  };
  amount: number;
  price?: number;
  totalValue?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  totalDeposits: number;
  totalWithdrawals: number;
  totalInvested: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
  transactionCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/portfolio/transactions`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  createTransaction(data: Partial<Transaction>): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/portfolio/transactions`, data, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  updateTransaction(id: string, data: Partial<Transaction>): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/portfolio/transactions/${id}`, data, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  deleteTransaction(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/portfolio/transactions/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/portfolio/dashboard`, {
      headers: this.authService.getAuthHeaders(),
    });
  }
}

