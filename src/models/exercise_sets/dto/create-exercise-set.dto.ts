import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateExerciseSetDto {
  @ApiProperty({ description: 'The ID of the workout exercise this set belongs to' })
  @IsInt()
  @Type(() => Number)
  workout_exercise_id: number;

  @ApiProperty({ description: 'The set number in the sequence' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  set_number: number;

  @ApiProperty({ description: 'Number of repetitions for this set' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  reps: number;

  @ApiPropertyOptional({ description: 'Whether the set has been completed', default: false })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @ApiPropertyOptional({ description: 'Timestamp when the set was completed' })
  @IsOptional()
  completed_at?: Date;
}
