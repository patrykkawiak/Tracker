import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="card" style="max-width: 400px; margin: 50px auto;">
        <h2 style="margin-bottom: 20px;">Rejestracja</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Imię</label>
            <input type="text" [(ngModel)]="firstName" name="firstName" required />
          </div>
          <div class="form-group">
            <label>Nazwisko</label>
            <input type="text" [(ngModel)]="lastName" name="lastName" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required />
          </div>
          <div class="form-group">
            <label>Hasło</label>
            <input type="password" [(ngModel)]="password" name="password" required minlength="6" />
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="loading">
            {{ loading ? 'Rejestracja...' : 'Zarejestruj' }}
          </button>
          <p style="margin-top: 15px; text-align: center;">
            Masz już konto? <a routerLink="/login">Zaloguj się</a>
          </p>
          <p *ngIf="error" style="color: red; margin-top: 10px;">{{ error }}</p>
        </form>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    this.authService
      .register({
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Błąd rejestracji';
          this.loading = false;
        },
      });
  }
}

