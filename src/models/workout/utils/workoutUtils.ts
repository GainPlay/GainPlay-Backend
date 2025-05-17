// import { workouts } from "@prisma/client";
import { UpdateWorkoutDto } from "@/models/workout/dto/updateWorkoutDto";

export const calcWorkoutCoins = (workout: UpdateWorkoutDto): number => {
  console.log(workout);
  return 100;
};
