import { IsEnum, IsNumber, IsString, IsOptional, IsUUID } from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsUUID()
  @IsOptional()
  assetId?: string;

  @IsString()
  @IsOptional()
  assetName?: string;

  @IsString()
  @IsOptional()
  assetTicker?: string;

  @IsString()
  @IsOptional()
  assetSymbol?: string;

  @IsString()
  @IsOptional()
  assetType?: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  totalValue?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

