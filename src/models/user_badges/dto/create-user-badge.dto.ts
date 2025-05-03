import { IsInt, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserBadgeDto {
  @IsInt()
  @IsOptional()
  user_id?: number;

  @IsInt()
  @IsOptional()
  badge_id?: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  earned_at?: Date;
}