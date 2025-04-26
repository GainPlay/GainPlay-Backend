import { IsInt, IsOptional, Min } from "class-validator";

export class UpdateUserGoalDto {
  @IsInt()
  @IsOptional()
  user_id?: number;

  @IsInt()
  @IsOptional()
  goal_id?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  value?: number;
}
