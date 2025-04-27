import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserAvatarDto {
  @IsBoolean()
  @IsOptional()
  is_current?: boolean;
}
