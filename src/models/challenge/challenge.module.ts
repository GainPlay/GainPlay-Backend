import { Module } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";
import { ExerciseService } from "@/models/exercise/exercise.service";
import { ExerciseRepository } from "@/models/exercise/exercise.repository";

@Module({
  exports: [ExerciseService],
  providers: [PrismaService, ExerciseService, ExerciseRepository],
})
export class ExerciseModule {}
