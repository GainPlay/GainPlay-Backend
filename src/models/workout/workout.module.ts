import { Module } from "@nestjs/common";
import { PrismaModule } from "database/prisma.module";
import { BadgesService } from "@/models/badge/badges.service";
import { ExerciseModule } from "@/models/exercise/exercise.module";
import { GeminiService } from "./gemini.service";
import { WorkoutService } from "./workout.service";
import { BadgesModule } from "../badge/badges.module";
import { WorkoutController } from "./workout.controller";
import { UserGoalsModule } from "../user_goal/user-goals.module";
import { UserSettingsModule } from "../user_setting/user-settings.module";
@Module({
  controllers: [WorkoutController],
  providers: [WorkoutService, GeminiService, BadgesService],
  imports: [
    PrismaModule,
    UserGoalsModule,
    UserSettingsModule,
    ExerciseModule,
    BadgesModule,
  ],
})
export class WorkoutModule {}
