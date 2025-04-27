import { Module } from "@nestjs/common";
import { WorkoutController } from "./workout.controller";
import { WorkoutService } from "./workout.service";
import { GeminiService } from "./gemini.service";
import { UserGoalsModule } from "../user-goals/user-goals.module";
import { UserSettingsModule } from "../user-settings/user-settings.module";
import { PrismaModule } from "database/prisma.module";

@Module({
  imports: [PrismaModule, UserGoalsModule, UserSettingsModule],
  controllers: [WorkoutController],
  providers: [WorkoutService, GeminiService],
})
export class WorkoutModule {}
