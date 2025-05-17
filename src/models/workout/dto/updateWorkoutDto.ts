import { workout_exercises } from "@prisma/client";
import { IsDateString, IsInt, IsNotEmpty } from "class-validator";

export class UpdateWorkoutDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsNotEmpty()
  @IsDateString()
  started_at: string;

  workout_exercises: workout_exercises[];
}
