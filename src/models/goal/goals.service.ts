import { goals } from "@prisma/client";
import { Injectable, NotFoundException } from "@nestjs/common";
import { GoalsRepository } from "./goals.repository";

@Injectable()
export class GoalsService {
  constructor(private readonly goalsRepository: GoalsRepository) {}

  async findById(id: number): Promise<goals> {
    const goal = await this.goalsRepository.findOneById(id);
    if (!goal) {
      throw new NotFoundException(`goal with id ${id} not found`);
    }
    return goal;
  }

  async findAll(): Promise<goals[]> {
    const goals = await this.goalsRepository.findAll();
    return goals;
  }

  async createGoal(goalData: Omit<goals, "id">): Promise<goals> {
    return this.goalsRepository.create(goalData);
  }

  async updateGoal(goalId: number, goalData: Partial<goals>): Promise<goals> {
    await this.findById(goalId);
    return this.goalsRepository.update(goalId, goalData);
  }

  async deleteGoal(goalId: number): Promise<void> {
    await this.goalsRepository.delete(goalId);
  }
}
