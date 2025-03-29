import { Module } from '@nestjs/common';
import { WorkoutController } from './workout.controller';
import { GeminiService } from './gemini.service';

@Module({
  controllers: [WorkoutController],
    providers: [GeminiService],

})
export class WorkoutModule {}
