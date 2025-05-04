import { Module } from '@nestjs/common';
import { ExerciseSetsService } from './exercise-sets.service';
import { ExerciseSetsController } from './exercise-sets.controller';
import { ExerciseSetsRepository } from './exercise-sets.repository';
import { PrismaModule } from 'database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExerciseSetsController],
  providers: [ExerciseSetsService, ExerciseSetsRepository],
  exports: [ExerciseSetsService]
})
export class ExerciseSetsModule {}