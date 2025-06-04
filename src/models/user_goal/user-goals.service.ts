// user-goals.service.ts
import { Prisma } from "@prisma/client";
import { PrismaService } from "database/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserGoalsRepository } from "./user-goals.repository";
import { GeminiService, UserHealthData, Insight } from "./gemini.service";

@Injectable()
export class UserGoalsService {
  constructor(
    private userGoalsRepository: UserGoalsRepository,
    private geminiService: GeminiService,
    private prisma: PrismaService, // Add PrismaService for complex queries
  ) {}

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

  // New method to get health insights for a user
  async getHealthInsights(userId: number): Promise<Insight[]> {
    const userData = await this.buildUserHealthData(userId);
    return this.geminiService.generateHealthInsights(userData);
  }

  // New method to build comprehensive user health data
  private async buildUserHealthData(userId: number): Promise<UserHealthData> {
    // Get user basic info
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        name: true,
        level: true,
        coins: true,
        streak: true,
        experience: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Get user settings
    const settings = await this.prisma.user_settings.findUnique({
      where: { user_id: userId },
      select: {
        age: true,
        weight: true,
        height: true,
        fitness_level: true,
        body_structure: true,
        workout_duration: true,
        exercise_frequency: true,
      },
    });

    // Get recent workouts (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentWorkouts = await this.prisma.workouts.findMany({
      take: 10, // Limit to last 10 workouts
      orderBy: {
        started_at: "desc",
      },
      where: {
        user_id: userId,
        started_at: {
          gte: thirtyDaysAgo,
        },
      },
      include: {
        workout_exercises: {
          include: {
            exercises: {
              select: {
                name: true,
              },
            },
            exercise_sets: {
              select: {
                reps: true,
                set_number: true,
                completed_reps: true,
              },
            },
          },
        },
      },
    });

    // Get user badges
    const badges = await this.prisma.user_badges.findMany({
      where: { user_id: userId },
      orderBy: {
        earned_at: "desc",
      },
      include: {
        badges: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get user goals
    const goals = await this.prisma.user_goals.findMany({
      where: { user_id: userId },
      include: {
        goals: {
          select: {
            name: true,
          },
        },
      },
    });

    // Transform data to match UserHealthData interface
    return {
      goals: goals.map(ug => ({
        value: ug.value || 0,
        name: ug.goals?.name || "Unknown Goal",
      })),
      badges: badges.map(ub => ({
        name: ub.badges?.name || "Unknown Badge",
        earned_at: ub.earned_at?.toISOString() || new Date().toISOString(),
      })),
      user: {
        level: user.level || 1,
        coins: user.coins || 0,
        streak: user.streak || 0,
        name: user.name || "User",
        experience: user.experience || 0,
      },
      settings: {
        age: settings?.age || 25,
        weight: settings?.weight || 70,
        height: settings?.height || 170,
        fitness_level: settings?.fitness_level || 3,
        workout_duration: settings?.workout_duration || 45,
        exercise_frequency: settings?.exercise_frequency || 3,
        body_structure: settings?.body_structure || "Average",
      },
      recentWorkouts: recentWorkouts.map(workout => ({
        score: workout.score || 0,
        coins_earned: workout.coins_earned || 0,
        experience_earned: workout.experience_earned || 0,
        started_at:
          workout.started_at?.toISOString() || new Date().toISOString(),
        completed_at:
          workout.completed_at?.toISOString() || new Date().toISOString(),
        exercises: workout.workout_exercises.map(we => {
          const totalSets = we.exercise_sets.length;
          const totalReps = we.exercise_sets.reduce(
            (sum, set) => sum + (set.reps || 0),
            0,
          );
          const totalCompletedReps = we.exercise_sets.reduce(
            (sum, set) => sum + (set.completed_reps || 0),
            0,
          );

          return {
            sets: totalSets,
            name: we.exercises?.name || "Unknown Exercise",
            reps: Math.round(totalReps / Math.max(totalSets, 1)),
            completed_reps: Math.round(
              totalCompletedReps / Math.max(totalSets, 1),
            ),
          };
        }),
      })),
    };
  }

  // Additional helper method to get user health summary
  async getUserHealthSummary(userId: number) {
    const userData = await this.buildUserHealthData(userId);
    const insights = await this.geminiService.generateHealthInsights(userData);

    return {
      insights,
      user: userData.user,
      settings: userData.settings,
      stats: {
        activeGoals: userData.goals.length,
        totalBadges: userData.badges.length,
        totalWorkouts: userData.recentWorkouts.length,
        averageScore:
          userData.recentWorkouts.length > 0
            ? Math.round(
                userData.recentWorkouts.reduce((sum, w) => sum + w.score, 0) /
                  userData.recentWorkouts.length,
              )
            : 0,
      },
    };
  }
}
