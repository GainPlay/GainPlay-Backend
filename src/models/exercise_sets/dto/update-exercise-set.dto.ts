import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, Min } from "class-validator";

export class UpdateExerciseSetDto {
  @ApiPropertyOptional({
    description: "The ID of the workout exercise this set belongs to",
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  workout_exercise_id?: number;

  @ApiPropertyOptional({ description: "The set number in the sequence" })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  set_number?: number;

  @ApiPropertyOptional({ description: "Number of repetitions for this set" })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  reps?: number;

  @ApiPropertyOptional({
    default: false,
    description: "Whether the set has been completed",
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @ApiPropertyOptional({ description: "Timestamp when the set was completed" })
  @IsOptional()
  completed_at?: Date;
}
