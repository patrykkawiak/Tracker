import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Log } from './entities/log.entity';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class AppService {
  private readonly authServiceUrl = 'http://localhost:3001';

  constructor(
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
    private httpService: HttpService,
  ) {}

  async verifyToken(authHeader: string): Promise<string> {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    if (authHeader === `Bearer ${process.env.INTERNAL_TOKEN || 'internal'}`) {
      return 'internal';
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    const token = authHeader.substring(7);
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      
      if (!response.data || !response.data.userId) {
        throw new UnauthorizedException('Invalid response from auth service');
      }
      
      return response.data.userId;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new UnauthorizedException('Token verification failed');
      }
      if (error.code === 'ECONNREFUSED' || error.message?.includes('connect')) {
        throw new UnauthorizedException('Cannot connect to auth service');
      }
      throw new UnauthorizedException(`Token verification error: ${error.message || 'Unknown error'}`);
    }
  }

  async createLog(createLogDto: CreateLogDto) {
    const log = this.logRepository.create({
      userId: createLogDto.userId,
      action: createLogDto.action,
      details: createLogDto.details,
      timestamp: createLogDto.timestamp ? new Date(createLogDto.timestamp) : new Date(),
    });

    return this.logRepository.save(log);
  }

  async getLogs(authHeader: string, userId?: string) {
    try {
      const requestingUserId = await this.verifyToken(authHeader);

      const filterUserId = requestingUserId === 'internal' ? userId : requestingUserId;

      const logs = await this.logRepository.find({
        where: filterUserId ? { userId: filterUserId } : {},
        order: { timestamp: 'DESC' },
        take: 100,
      });

      return logs;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new HttpException(
        `Failed to fetch logs: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

