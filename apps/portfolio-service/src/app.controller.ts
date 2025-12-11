import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Headers,
  Request,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('transactions')
  async getTransactions(@Headers('authorization') authHeader: string) {
    const userId = await this.appService.getUserIdFromToken(authHeader);
    return this.appService.getTransactions(userId);
  }

  @Post('transactions')
  async createTransaction(
    @Headers('authorization') authHeader: string,
    @Body() createDto: CreateTransactionDto,
  ) {
    const userId = await this.appService.getUserIdFromToken(authHeader);
    return this.appService.createTransaction(userId, createDto);
  }

  @Put('transactions/:id')
  async updateTransaction(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateTransactionDto,
  ) {
    const userId = await this.appService.getUserIdFromToken(authHeader);
    return this.appService.updateTransaction(userId, id, updateDto);
  }

  @Delete('transactions/:id')
  async deleteTransaction(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
  ) {
    const userId = await this.appService.getUserIdFromToken(authHeader);
    return this.appService.deleteTransaction(userId, id);
  }

  @Get('dashboard')
  async getDashboard(@Headers('authorization') authHeader: string) {
    const userId = await this.appService.getUserIdFromToken(authHeader);
    return this.appService.getDashboard(userId);
  }
}

