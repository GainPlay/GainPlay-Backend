import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ExerciseSetDto {
  @ApiProperty({ description: "Unique identifier for the exercise set" })
  id: number;

  @ApiProperty({
    description: "The ID of the workout exercise this set belongs to",
  })
  workout_exercise_id: number;

  @ApiProperty({ description: "The set number in the sequence" })
  set_number: number;

  @ApiProperty({ description: "Number of repetitions for this set" })
  reps: number;

  @ApiProperty({
    default: false,
    description: "Whether the set has been completed",
  })
  completed: boolean;

  @ApiPropertyOptional({ description: "Timestamp when the set was completed" })
  completed_at?: Date | null;
}
