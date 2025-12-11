import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Log {
  id: string;
  userId: string;
  action: string;
  details: any;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getLogs(): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.apiUrl}/logs`, {
      headers: this.authService.getAuthHeaders(),
    });
  }
}

