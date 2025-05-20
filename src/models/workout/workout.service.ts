import { workouts } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";
import { calcWorkoutCoins } from "@/models/workout/utils/workoutUtils";
import { UpdateWorkoutDto } from "@/models/workout/dto/updateWorkoutDto";
import { GeminiService } from "./gemini.service";

@Injectable()
export class WorkoutService {
  constructor(
    private prisma: PrismaService,
    private geminiService: GeminiService,
  ) {}

  async generateAndSaveWorkout(userId: number) {
    const workoutExercises = await this.geminiService.generateWorkout(userId);

    const workout = await this.prisma.workouts.create({
      data: {
        user_id: userId,
        coins_earned: 0,
        started_at: new Date(),
      },
    });

    const createdWorkoutExercises = [];

    for (const exercise of workoutExercises) {
      let exerciseTemplate = await this.prisma.exercise_templates.findFirst({
        where: {
          exercise_id: exercise.exerciseId,
          target_sets: exercise.targetSets,
          target_reps: exercise.targetReps,
          rest_time_seconds: exercise.restTimeSeconds,
        },
      });

      if (!exerciseTemplate) {
        exerciseTemplate = await this.prisma.exercise_templates.create({
          data: {
            exercise_id: exercise.exerciseId,
            target_sets: exercise.targetSets,
            target_reps: exercise.targetReps,
            rest_time_seconds: exercise.restTimeSeconds,
          },
        });
      }

      const workoutExercise = await this.prisma.workout_exercises.create({
        data: {
          workout_id: workout.id,
          exercise_id: exercise.exerciseId,
          template_id: exerciseTemplate.id,
        },
      });

      const exerciseSets = [];
      for (let i = 1; i <= exercise.targetSets; i++) {
        const set = await this.prisma.exercise_sets.create({
          data: {
            reps: 0,
            set_number: i,
            completed: false,
            workout_exercise_id: workoutExercise.id,
          },
        });
        exerciseSets.push(set);
      }

      createdWorkoutExercises.push({
        ...workoutExercise,
        sets: exerciseSets,
        notes: exercise.notes,
        target_sets: exercise.targetSets,
        target_reps: exercise.targetReps,
        rest_time: exercise.restTimeSeconds,
        exercise_name: exercise.exerciseName,
      });
    }

    return {
      ...workout,
      exercises: createdWorkoutExercises,
    };
  }

  async findAll(userId: number) {
    return await this.prisma.workouts.findMany({
      select: {
        started_at: true,
        workout_exercises: {
          select: {
            exercises: {
              select: {
                name: true,
                
              }
            },
            exercise_sets: true,
          },
        },
      },
      where: { user_id: userId }
    });
  }
  // date: string;
  // exercises: {
  //   name: string;
  //   sets: { completed: boolean; reps: number }[];
  //   totalReps: number;
  //   xpEarned?: number;
  // }[];

  // model workouts {
  //   id                Int                 @id @default(autoincrement())
  //   user_id           Int?
  //   started_at        DateTime?           @default(now()) @db.Timestamp(6)
  //   completed_at      DateTime?           @db.Timestamp(6)
  //   coins_earned      Int?
  //   workout_exercises workout_exercises[]
  //   users             users?              @relation(fields: [user_id], references: [id], onDelete: NoAction, onUpdate: NoAction)
  // }
//   model exercises {
//     id                 Int                  @id @default(autoincrement())
//     name               String?              @unique @db.VarChar
//     description        String?
//     category           String?              @db.VarChar
//     difficulty_level   Int?
//     muscle_group       String?              @db.VarChar
//     exercise_templates exercise_templates[]
//     workout_exercises  workout_exercises[]
// }
  
// model exercise_sets {
//   id                  Int                @id @default(autoincrement())
//   workout_exercise_id Int?
//   set_number          Int?
//   reps                Int?
//   completed           Boolean?           @default(false)
//   completed_at        DateTime?          @db.Timestamp(6)
//   workout_exercises   workout_exercises? @relation(fields: [workout_exercise_id], references: [id], onDelete: NoAction, onUpdate: NoAction)
// }
  
  async findOne(id: number) {
    return await this.prisma.workouts.findMany({ where: { id: id } });
  }

  async findcurrentWorkout(userId: number) {
    return await this.prisma.workouts.findFirst({
      where: {
        user_id: userId,
        completed_at: null,
      },
    });
  }

  async finishWorkout(updateWorkoutDto: UpdateWorkoutDto): Promise<workouts> {
    const coins = calcWorkoutCoins(updateWorkoutDto);

    return await this.prisma.$transaction(async tx => {
      const workout = await tx.workouts.update({
        where: {
          id: updateWorkoutDto.id,
        },
        data: {
          coins_earned: coins,
          completed_at: new Date().toISOString(),
        },
      });

      await tx.users.update({
        where: {
          id: workout.user_id,
        },
        data: {
          coins: {
            increment: coins,
          },
        },
      });
      return workout;
    });
  }
}
