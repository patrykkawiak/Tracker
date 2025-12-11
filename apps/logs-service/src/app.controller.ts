import { Controller, Get, Post, Body, Headers, Query, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateLogDto } from './dto/create-log.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('logs')
  async createLog(
    @Body() createLogDto: CreateLogDto,
    @Headers('authorization') authHeader?: string,
  ) {
    if (authHeader) {
      const internalToken = process.env.INTERNAL_TOKEN || 'internal';
      if (authHeader !== `Bearer ${internalToken}`) {
        throw new UnauthorizedException('Invalid internal token');
      }
    }
    return this.appService.createLog(createLogDto);
  }

  @Get('logs')
  async getLogs(
    @Headers('authorization') authHeader: string,
    @Query('userId') userId?: string,
  ) {
    return this.appService.getLogs(authHeader, userId);
  }
}

