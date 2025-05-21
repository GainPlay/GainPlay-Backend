import { users } from "@prisma/client";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "@/models/users/users.repository";
import { OnboardingDto } from "./dto/onboarding.dto";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(): Promise<users[]> {
    const users = await this.usersRepository.findAll();
    return users.map(user => user);
  }

  async findByEmail(email: string): Promise<users> {
    const user = await this.usersRepository.findOneByEmail(email);

    return user;
  }

  async findById(id: number): Promise<users> {
    const user = await this.usersRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async createUser(userData: Omit<users, "id">): Promise<users> {
    return this.usersRepository.create(userData);
  }

  async updateUser(userId: number, userData: Partial<users>): Promise<users> {
    await this.usersRepository.updateUserSettings(userId,userData)
    return this.usersRepository.update(userId, userData);
  }

  async updateOnboardingData(userId: number, onboardingData: OnboardingDto) {
    const user = await this.usersRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const userSettingsData = {
      fitness_level: onboardingData.fitnessLevel,
      workout_duration: onboardingData.workoutDuration,
      exercise_frequency: onboardingData.workoutFrequency,
      body_structure: onboardingData.bodyStructure || null,
    };

    if (onboardingData.technicalData) {
      if (onboardingData.technicalData.age) {
        userSettingsData["age"] = onboardingData.technicalData.age;
      }
      if (onboardingData.technicalData.weight) {
        userSettingsData["weight"] = onboardingData.technicalData.weight;
      }
      if (onboardingData.technicalData.height) {
        userSettingsData["height"] = onboardingData.technicalData.height;
      }
    }

    const updatedSettings = await this.usersRepository.updateUserSettings(
      userId,
      userSettingsData,
    );

    const userGoals = [];
    for (const [goalId, goalValue] of Object.entries(
      onboardingData.fitnessGoals,
    )) {
      if (goalValue > 0) {
        const userGoal = await this.usersRepository.createOrUpdateUserGoal(
          userId,
          parseInt(goalId),
          goalValue,
        );
        userGoals.push(userGoal);
      }
    }

    return {
      userGoals,
      userSettings: updatedSettings,
    };
  }

  async addBadgeToUser(userId: number, badgeId: number): Promise<users> {
    const user = await this.usersRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const updatedUser = await this.usersRepository.addBadgeToUser(
      userId,
      badgeId,
    );

    return updatedUser;
  }
}
