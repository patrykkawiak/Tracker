import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateTransactionDto {
  @IsNumber()
  @IsOptional()
  amount?: number;

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

