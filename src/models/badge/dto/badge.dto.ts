import { IsNumber, IsOptional, IsString, IsDate } from 'class-validator';

export class BadgeDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  created_at?: Date;
}