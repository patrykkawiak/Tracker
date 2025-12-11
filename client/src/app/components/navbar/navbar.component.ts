import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container">
        <h1>Portfolio Inwestycyjne</h1>
        <nav *ngIf="authService.isAuthenticated()">
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/portfolio" routerLinkActive="active">Portfel</a>
          <a routerLink="/logs" routerLinkActive="active">Logi</a>
          <a (click)="logout()" style="cursor: pointer;">Wyloguj</a>
        </nav>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  logout(): void {
    this.authService.logout();
  }
}

