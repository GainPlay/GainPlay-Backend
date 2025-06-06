import { users } from "@prisma/client";
import { PrismaService } from "database/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "@/models/users/users.repository";
import { OnboardingDto } from "./dto/onboarding.dto";

// Create a mapping array that matches your seeder order
const GOAL_NAME_MAPPING = [
  "Lose Weight", // Frontend ID: 0
  "Gain Muscle", // Frontend ID: 1
  "Improve Endurance", // Frontend ID: 2
  "Increase Strength", // Frontend ID: 3
  "Improve Flexibility", // Frontend ID: 4
  "Maintain Health", // Frontend ID: 5
];

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly prisma: PrismaService,
  ) {}

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
    await this.usersRepository.updateUserSettings(userId, userData);
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

    // Fetch all goals once and create a name-to-id mapping
    const allGoals = await this.prisma.goals.findMany();
    const goalNameToIdMap = new Map(allGoals.map(goal => [goal.name, goal.id]));

    const userGoals = [];
    for (const [frontendGoalId, goalValue] of Object.entries(
      onboardingData.fitnessGoals,
    )) {
      if (goalValue > 0) {
        const goalName = GOAL_NAME_MAPPING[parseInt(frontendGoalId)];
        if (!goalName) {
          throw new Error(`Invalid frontend goal ID: ${frontendGoalId}`);
        }

        const dbGoalId = goalNameToIdMap.get(goalName);
        if (!dbGoalId) {
          throw new Error(`Goal not found in database: ${goalName}`);
        }

        const userGoal = await this.usersRepository.createOrUpdateUserGoal(
          userId,
          dbGoalId,
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
