export class ExerciseDto {
  name: string;
  sets: number;
  reps: string | number;
  rest: string;
  notes?: string;
}

export class WorkoutDayDto {
  day: string;
  focus: string;
  exercises: ExerciseDto[];
}

export class WorkoutProgramDto {
  name: string;
  duration: string;
  schedule: WorkoutDayDto[];
}

export class WorkoutResponseDto {
  program: WorkoutProgramDto;
  notes?: string;
}