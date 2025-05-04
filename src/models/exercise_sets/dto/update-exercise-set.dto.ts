import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateExerciseSetDto {
  @ApiPropertyOptional({ description: 'The ID of the workout exercise this set belongs to' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  workout_exercise_id?: number;

  @ApiPropertyOptional({ description: 'The set number in the sequence' })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  set_number?: number;

  @ApiPropertyOptional({ description: 'Number of repetitions for this set' })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  reps?: number;

  @ApiPropertyOptional({ description: 'Whether the set has been completed', default: false })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @ApiPropertyOptional({ description: 'Timestamp when the set was completed' })
  @IsOptional()
  completed_at?: Date;
}
