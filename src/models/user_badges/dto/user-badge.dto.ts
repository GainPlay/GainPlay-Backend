import { IsInt, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UserBadgeDto {
  @IsInt()
  id: number;

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
