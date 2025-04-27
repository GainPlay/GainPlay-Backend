import { IsInt, IsOptional, Min } from "class-validator";

export class CreateUserGoalDto {
  @IsInt()
  user_id: number;

  @IsInt()
  goal_id: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  value?: number;
}
