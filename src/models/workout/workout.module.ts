import { Module } from "@nestjs/common";
import { GeminiService } from "./gemini.service";
import { WorkoutController } from "./workout.controller";

@Module({
  providers: [GeminiService],
  controllers: [WorkoutController],
})
export class WorkoutModule {}
