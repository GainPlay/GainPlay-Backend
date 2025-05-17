import { Module } from "@nestjs/common";
import { PrismaModule } from "database/prisma.module";
import { ExerciseSetsService } from "./exercise-sets.service";
import { ExerciseSetsController } from "./exercise-sets.controller";
import { ExerciseSetsRepository } from "./exercise-sets.repository";

@Module({
  imports: [PrismaModule],
  exports: [ExerciseSetsService],
  controllers: [ExerciseSetsController],
  providers: [ExerciseSetsService, ExerciseSetsRepository],
})
export class ExerciseSetsModule {}
