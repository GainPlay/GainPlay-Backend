import { IsBoolean, IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserAvatarDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsInt()
  @IsNotEmpty()
  avatar_id: number;

  @IsBoolean()
  @IsOptional()
  is_current?: boolean;
}
