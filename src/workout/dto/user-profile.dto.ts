export class UserProfileDto {
  age: number;
  gender: string;
  height: number; // in cm
  weight: number; // in kg
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  limitations?: string[];
  preferredWorkoutDays: number;
  equipmentAvailable: string[];
  workoutDuration: number; // in minutes
}
