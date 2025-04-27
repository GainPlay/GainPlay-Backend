import { IsInt, IsOptional, Max, Min } from "class-validator";

export class CreateUserSettingsDto {
  @IsInt()
  user_id: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(7)
  exercise_frequency?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(5)
  fitness_level?: number;
}
