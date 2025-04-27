import { Controller, Get, Post, Param, Body, Put, NotFoundException, Delete } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { goals } from '@prisma/client';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get(':id')
  async getGoal(@Param('id') id: number): Promise<goals> {
    try {
      return await this.goalsService.findById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get()
  async getAllGoals(): Promise<goals[]> {
    return await this.goalsService.findAll();
  }

  @Post()
  async createGoal(@Body() goalData: Omit<goals, 'id'>): Promise<goals> {
    return await this.goalsService.createGoal(goalData);
  }

  @Put(':id')
  async updateGoal(@Param('id') id: number, @Body() goalData: Partial<goals>): Promise<goals> {
    try {
      return await this.goalsService.updateGoal(id, goalData);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  async deleteGoal(@Param('id') id: number): Promise<void> {
    try {
      await this.goalsService.deleteGoal(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
