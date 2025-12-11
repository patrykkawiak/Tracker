import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { Asset } from './entities/asset.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class AppService {
  private readonly authServiceUrl = 'http://localhost:3001';
  private readonly logsServiceUrl = 'http://localhost:3003';

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
    private httpService: HttpService,
  ) {}

  async getUserIdFromToken(authHeader: string): Promise<string> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token');
    }

    const token = authHeader.substring(7);
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      return response.data.userId;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async logEvent(userId: string, action: string, details: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.logsServiceUrl}/logs`,
          {
            userId,
            action,
            details,
            timestamp: new Date().toISOString(),
          },
          {
            headers: { Authorization: `Bearer ${process.env.INTERNAL_TOKEN || 'internal'}` },
          },
        ),
      );
      console.log('Log created successfully:', response.data);
    } catch (error) {
      console.error('Failed to log event:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        userId,
        action,
      });
    }
  }

  async getTransactions(userId: string) {
    const transactions = await this.transactionRepository.find({
      where: { userId },
      relations: ['asset'],
      order: { createdAt: 'DESC' },
    });
    return transactions;
  }

  async createTransaction(userId: string, createDto: CreateTransactionDto) {
    let asset: Asset | null = null;

    if (createDto.assetId) {
      asset = await this.assetRepository.findOne({
        where: { id: createDto.assetId },
      });
      if (!asset) {
        throw new NotFoundException('Asset not found');
      }
    } else if (createDto.assetName) {
      asset = await this.assetRepository.findOne({
        where: { name: createDto.assetName },
      });

      if (!asset) {
        asset = this.assetRepository.create({
          name: createDto.assetName,
          ticker: createDto.assetTicker,
          symbol: createDto.assetSymbol,
          type: createDto.assetType || 'stock',
        });
        asset = await this.assetRepository.save(asset);
      }
    }

    const transaction = this.transactionRepository.create({
      userId,
      type: createDto.type,
      assetId: asset?.id,
      amount: createDto.amount,
      price: createDto.price,
      totalValue: createDto.totalValue || (createDto.price ? createDto.amount * createDto.price : createDto.amount),
      notes: createDto.notes,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    await this.logEvent(userId, 'TRANSACTION_CREATED', {
      transactionId: savedTransaction.id,
      type: savedTransaction.type,
    });

    return savedTransaction;
  }

  async updateTransaction(userId: string, id: string, updateDto: UpdateTransactionDto) {
    const transaction = await this.transactionRepository.findOne({
      where: { id, userId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    Object.assign(transaction, updateDto);
    const updatedTransaction = await this.transactionRepository.save(transaction);

    await this.logEvent(userId, 'TRANSACTION_UPDATED', {
      transactionId: updatedTransaction.id,
    });

    return updatedTransaction;
  }

  async deleteTransaction(userId: string, id: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id, userId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    await this.transactionRepository.remove(transaction);

    await this.logEvent(userId, 'TRANSACTION_DELETED', {
      transactionId: id,
    });

    return { message: 'Transaction deleted successfully' };
  }

  async getDashboard(userId: string) {
    const transactions = await this.transactionRepository.find({
      where: { userId },
      relations: ['asset'],
    });

    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let totalInvested = 0;
    let currentValue = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === TransactionType.DEPOSIT) {
        totalDeposits += Number(transaction.amount);
      } else if (transaction.type === TransactionType.WITHDRAWAL) {
        totalWithdrawals += Number(transaction.amount);
      } else if (transaction.type === TransactionType.BUY) {
        totalInvested += Number(transaction.totalValue || transaction.amount * (transaction.price || 0));
        currentValue += Number(transaction.totalValue || transaction.amount * (transaction.price || 0));
      } else if (transaction.type === TransactionType.SELL) {
        totalInvested -= Number(transaction.totalValue || transaction.amount * (transaction.price || 0));
        currentValue -= Number(transaction.totalValue || transaction.amount * (transaction.price || 0));
      }
    });

    const profitLoss = currentValue - totalInvested;
    const profitLossPercent = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

    return {
      totalDeposits,
      totalWithdrawals,
      totalInvested,
      currentValue,
      profitLoss,
      profitLossPercent: Number(profitLossPercent.toFixed(2)),
      transactionCount: transactions.length,
    };
  }
}

