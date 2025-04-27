import { Injectable } from "@nestjs/common";
import { goals } from "@prisma/client";
import { PrismaService } from "database/prisma.service";

@Injectable()
export class GoalsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.goals.findMany();
  }
    
  async findOneById(id: number): Promise<goals | null> {
    return this.prisma.goals.findUnique({ where: { id } });
  }
  
  async create(goalsData: Omit<goals, "id">): Promise<goals> {
    return this.prisma.goals.create({ data: goalsData });
  }
  
  async update(
    goalsId: number,
    goalsInformation: Partial<goals>,
  ): Promise<goals> {
    return this.prisma.goals.update({
      where: { id: goalsId },
      data: goalsInformation,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.goals.delete({
      where: { id },
    });
  }
}