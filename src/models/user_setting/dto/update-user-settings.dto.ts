import { IsInt, IsOptional, Max, Min } from "class-validator";

export class UpdateUserSettingsDto {
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

  @IsOptional()
  weight?: number;

  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(300)
  height?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(120)
  age?: number;
}
