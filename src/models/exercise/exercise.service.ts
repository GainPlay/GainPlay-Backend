import { exercises } from "@prisma/client";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ExerciseRepository } from "@/models/exercise/exercise.repository";

@Injectable()
export class ExerciseService {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  async findById(id: number): Promise<exercises> {
    const exercise = await this.exerciseRepository.findOneById(id);
    if (!exercise) {
      throw new NotFoundException(`exercise with id ${id} not found`);
    }
    return exercise;
  }

  async findAll(): Promise<exercises[]> {
    return await this.exerciseRepository.findAll();
  }

  async createExercise(
    exerciseData: Omit<exercises, "id">,
  ): Promise<exercises> {
    return this.exerciseRepository.create(exerciseData);
  }

  async updateExercise(
    exerciseId: number,
    exerciseData: Partial<exercises>,
  ): Promise<exercises> {
    await this.findById(exerciseId);
    return this.exerciseRepository.update(exerciseId, exerciseData);
  }

  async deleteExercise(exerciseId: number): Promise<void> {
    await this.exerciseRepository.delete(exerciseId);
  }
}
