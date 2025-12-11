import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private readonly authServiceUrl = 'http://localhost:3001';
  private readonly portfolioServiceUrl = 'http://localhost:3002';
  private readonly logsServiceUrl = 'http://localhost:3003';

  constructor(private readonly httpService: HttpService) {}

  async register(registerDto: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/register`, registerDto),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Registration failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginDto: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/login`, loginDto),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Login failed',
        error.response?.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async verifyToken(authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.substring(7);
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  async getTransactions(authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.portfolioServiceUrl}/transactions`, {
          headers: { Authorization: authHeader },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to fetch transactions',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createTransaction(authHeader: string, transactionDto: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.portfolioServiceUrl}/transactions`,
          transactionDto,
          { headers: { Authorization: authHeader } },
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to create transaction',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateTransaction(authHeader: string, id: string, transactionDto: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(
          `${this.portfolioServiceUrl}/transactions/${id}`,
          transactionDto,
          { headers: { Authorization: authHeader } },
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to update transaction',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteTransaction(authHeader: string, id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.portfolioServiceUrl}/transactions/${id}`, {
          headers: { Authorization: authHeader },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to delete transaction',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getDashboard(authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.portfolioServiceUrl}/dashboard`, {
          headers: { Authorization: authHeader },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to fetch dashboard',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getLogs(authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.logsServiceUrl}/logs`, {
          headers: { Authorization: authHeader },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to fetch logs',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

