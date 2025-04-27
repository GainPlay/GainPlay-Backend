import { Injectable, NotFoundException } from '@nestjs/common';
import { UserGoalsRepository } from './user-goals.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserGoalsService {
  constructor(private userGoalsRepository: UserGoalsRepository) {}

  async findAll() {
    return this.userGoalsRepository.findAll();
  }

  async findOne(id: number) {
    const userGoal = await this.userGoalsRepository.findById(id);

    if (!userGoal) {
      throw new NotFoundException(`User goal with ID ${id} not found`);
    }

    return userGoal;
  }

  async findByUser(userId: number) {
    return this.userGoalsRepository.findByUserId(userId);
  }

  async create(data: Prisma.user_goalsCreateInput) {
    return this.userGoalsRepository.create(data);
  }

  async update(id: number, data: Prisma.user_goalsUpdateInput) {
    await this.findOne(id); // Verify the record exists
    
    return this.userGoalsRepository.update(id, {
      ...data,
      updated_at: new Date(),
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Verify the record exists
    
    return this.userGoalsRepository.delete(id);
  }

  async updateValue(id: number, value: number) {
    await this.findOne(id); // Verify the record exists
    
    return this.userGoalsRepository.update(id, {
      value,
      updated_at: new Date(),
    });
  }
}