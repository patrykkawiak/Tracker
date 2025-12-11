import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioService, Transaction } from '../../services/portfolio.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2>Portfel</h2>
        <button class="btn btn-primary" (click)="showModal = true">Dodaj Transakcję</button>
      </div>

      <div class="card">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Typ</th>
              <th>Aktywo</th>
              <th>Ilość</th>
              <th>Cena</th>
              <th>Wartość</th>
              <th>Notatki</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let transaction of transactions()">
              <td>{{ formatDate(transaction.createdAt) }}</td>
              <td>{{ getTypeLabel(transaction.type) }}</td>
              <td>{{ transaction.asset?.name || '-' }}</td>
              <td>{{ transaction.amount }}</td>
              <td>{{ transaction.price ? formatCurrency(transaction.price) : '-' }}</td>
              <td>{{ formatCurrency(transaction.totalValue || transaction.amount) }}</td>
              <td>{{ transaction.notes || '-' }}</td>
              <td>
                <button class="btn" style="padding: 5px 10px; margin-right: 5px;" (click)="editTransaction(transaction)">
                  Edytuj
                </button>
                <button class="btn btn-danger" style="padding: 5px 10px;" (click)="deleteTransaction(transaction.id)">
                  Usuń
                </button>
              </td>
            </tr>
            <tr *ngIf="transactions().length === 0">
              <td colspan="8" style="text-align: center; padding: 40px;">
                Brak transakcji. Dodaj pierwszą transakcję!
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="showModal" class="modal" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h3>{{ editingTransaction() ? 'Edytuj' : 'Dodaj' }} Transakcję</h3>
          <form (ngSubmit)="saveTransaction()">
            <div class="form-group">
              <label>Typ</label>
              <select [(ngModel)]="formData.type" name="type" required>
                <option value="deposit">Wpłata</option>
                <option value="withdrawal">Wypłata</option>
                <option value="buy">Kupno</option>
                <option value="sell">Sprzedaż</option>
              </select>
            </div>
            <div class="form-group">
              <label>Nazwa Aktywa</label>
              <input type="text" [(ngModel)]="formData.assetName" name="assetName" />
            </div>
            <div class="form-group">
              <label>Ilość</label>
              <input type="number" step="0.01" [(ngModel)]="formData.amount" name="amount" required />
            </div>
            <div class="form-group">
              <label>Cena (opcjonalnie)</label>
              <input type="number" step="0.01" [(ngModel)]="formData.price" name="price" />
            </div>
            <div class="form-group">
              <label>Notatki</label>
              <textarea [(ngModel)]="formData.notes" name="notes" rows="3"></textarea>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
              <button type="button" class="btn" (click)="closeModal()">Anuluj</button>
              <button type="submit" class="btn btn-primary">Zapisz</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal-content {
      background: white;
      padding: 30px;
      border-radius: 8px;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }
  `],
})
export class PortfolioComponent implements OnInit {
  transactions = signal<Transaction[]>([]);
  showModal = false;
  editingTransaction = signal<Transaction | null>(null);
  formData = {
    type: 'deposit' as 'deposit' | 'withdrawal' | 'buy' | 'sell',
    assetName: '',
    amount: 0,
    price: 0,
    notes: '',
  };
  loading = false;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    this.portfolioService.getTransactions().subscribe({
      next: (data) => {
        this.transactions.set(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading transactions:', err);
        this.loading = false;
      },
    });
  }

  editTransaction(transaction: Transaction): void {
    this.editingTransaction.set(transaction);
    this.formData = {
      type: transaction.type,
      assetName: transaction.asset?.name || '',
      amount: transaction.amount,
      price: transaction.price || 0,
      notes: transaction.notes || '',
    };
    this.showModal = true;
  }

  saveTransaction(): void {
    const transaction = this.editingTransaction();
    if (transaction) {
      this.portfolioService.updateTransaction(transaction.id, this.formData).subscribe({
        next: () => {
          this.closeModal();
          this.loadTransactions();
        },
        error: (err) => console.error('Error updating transaction:', err),
      });
    } else {
      this.portfolioService.createTransaction(this.formData).subscribe({
        next: () => {
          this.closeModal();
          this.loadTransactions();
        },
        error: (err) => console.error('Error creating transaction:', err),
      });
    }
  }

  deleteTransaction(id: string): void {
    if (confirm('Czy na pewno chcesz usunąć tę transakcję?')) {
      this.portfolioService.deleteTransaction(id).subscribe({
        next: () => {
          this.loadTransactions();
        },
        error: (err) => console.error('Error deleting transaction:', err),
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.editingTransaction.set(null);
    this.formData = {
      type: 'deposit',
      assetName: '',
      amount: 0,
      price: 0,
      notes: '',
    };
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(value);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pl-PL');
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      deposit: 'Wpłata',
      withdrawal: 'Wypłata',
      buy: 'Kupno',
      sell: 'Sprzedaż',
    };
    return labels[type] || type;
  }
}

