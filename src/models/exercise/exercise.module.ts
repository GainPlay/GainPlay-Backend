import { ExerciseRepository } from "@/models/exercise/exercise.repository";
import { ExerciseService } from "@/models/exercise/exercise.service";
import { Module } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";

@Module({
  exports: [ExerciseService],
  providers: [PrismaService, ExerciseService, ExerciseRepository],
})
export class ExerciseModule {}
