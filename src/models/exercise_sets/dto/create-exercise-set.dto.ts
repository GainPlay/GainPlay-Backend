import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, Min } from "class-validator";

export class CreateExerciseSetDto {
  @ApiProperty({
    description: "The ID of the workout exercise this set belongs to",
  })
  @IsInt()
  @Type(() => Number)
  workout_exercise_id: number;

  @ApiProperty({ description: "The set number in the sequence" })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  set_number: number;

  @ApiProperty({ description: "Number of repetitions for this set" })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  reps: number;

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
