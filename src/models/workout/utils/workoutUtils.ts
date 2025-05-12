import { UpdateWorkoutDto } from "@/models/workout/dto/updateWorkoutDto";
import { workouts } from "@prisma/client";

export const calcWorkoutCoins = (workout: UpdateWorkoutDto): number => {
  return 100;
};
