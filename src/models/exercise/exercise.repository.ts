import { Injectable } from "@nestjs/common";
import { exercises } from "@prisma/client";
import { PrismaService } from "database/prisma.service";

@Injectable()
export class ExerciseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOneById(id: number): Promise<exercises | null> {
    return this.prisma.exercises.findUnique({ where: { id } });
  }

  async findAll(): Promise<exercises[] | null> {
    return this.prisma.exercises.findMany();
  }

  async create(exerciseData: Omit<exercises, "id">): Promise<exercises> {
    return this.prisma.exercises.create({ data: exerciseData });
  }

  async update(
    exerciseId: number,
    exerciseInformation: Partial<exercises>,
  ): Promise<exercises> {
    return this.prisma.exercises.update({
      where: { id: exerciseId },
      data: exerciseInformation,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.goals.delete({
      where: { id },
    });
  }
}
