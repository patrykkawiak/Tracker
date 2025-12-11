import { IsUUID, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateLogDto {
  @IsUUID()
  userId: string;

  @IsString()
  action: string;

  @IsOptional()
  details?: any;

  @IsDateString()
  @IsOptional()
  timestamp?: string;
}

