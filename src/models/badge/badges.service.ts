// badges.service.ts

import { PrismaService } from "database/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateBadgeDto } from "./dto/create-badge.dto";
import { UpdateBadgeDto } from "./dto/update-badge.dto";

@Injectable()
export class BadgesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.badges.findMany({
      orderBy: { id: "asc" },
    });
  }

  async findOne(id: number) {
    const badge = await this.prisma.badges.findUnique({
      where: { id },
    });

    if (!badge) {
      throw new NotFoundException(`Badge with ID ${id} not found`);
    }

    return badge;
  }

  async create(createBadgeDto: CreateBadgeDto) {
    return await this.prisma.badges.create({
      data: createBadgeDto,
    });
  }

  async update(id: number, updateBadgeDto: UpdateBadgeDto) {
    await this.findOne(id); // Verify badge exists

    return await this.prisma.badges.update({
      where: { id },
      data: updateBadgeDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Verify badge exists

    return await this.prisma.badges.delete({
      where: { id },
    });
  }

  // User badge methods
  async getUserBadges(userId: number) {
    const userBadges = await this.prisma.user_badges.findMany({
      where: { user_id: userId },
      orderBy: { earned_at: "desc" },
      include: {
        badges: true,
      },
    });

    return userBadges.map(ub => ({
      id: ub.badges.id,
      name: ub.badges.name,
      icon: ub.badges.icon,
      earnedAt: ub.earned_at,
      description: ub.badges.description,
    }));
  }

  async checkAndAwardBadges(userId: number) {
    // Get user data with all relevant information
    const userData = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        user_avatars: true,
        sentFriendRequests: true,
        receivedFriendRequests: true,
        user_badges: {
          include: {
            badges: true,
          },
        },
        workouts: {
          include: {
            workout_exercises: {
              include: {
                exercises: true,
                exercise_sets: true,
              },
            },
          },
        },
      },
    });

    if (!userData) {
      throw new NotFoundException("User not found");
    }

    // Get all badges
    const allBadges = await this.prisma.badges.findMany();

    // Get already earned badge IDs
    const earnedBadgeIds = new Set(userData.user_badges.map(ub => ub.badge_id));

    // Check each badge condition
    const newBadges = [];

    for (const badge of allBadges) {
      if (earnedBadgeIds.has(badge.id)) continue;

      const earned = await this.checkBadgeCondition(badge, userData);
      if (earned) {
        newBadges.push(badge);
      }
    }

    // Award new badges
    if (newBadges.length > 0) {
      await this.prisma.user_badges.createMany({
        data: newBadges.map(badge => ({
          user_id: userId,
          badge_id: badge.id,
        })),
      });
    }

    return newBadges;
  }

  private async checkBadgeCondition(
    badge: any,
    userData: any,
  ): Promise<boolean> {
    const completedWorkouts = userData.workouts.filter(
      w => w.completed_at !== null,
    );

    // Calculate total reps and sets
    let totalReps = 0;
    let totalSets = 0;
    const exerciseTypes = new Set<number>();
    let upperBodyExercises = 0;
    let lowerBodyExercises = 0;
    let coreExercises = 0;

    completedWorkouts.forEach(workout => {
      workout.workout_exercises.forEach(we => {
        exerciseTypes.add(we.exercise_id);

        // Count muscle groups
        const muscleGroup = we.exercises?.muscle_group?.toLowerCase() || "";
        if (
          muscleGroup.includes("chest") ||
          muscleGroup.includes("back") ||
          muscleGroup.includes("shoulder") ||
          muscleGroup.includes("arm")
        ) {
          upperBodyExercises++;
        } else if (
          muscleGroup.includes("leg") ||
          muscleGroup.includes("glute") ||
          muscleGroup.includes("calf")
        ) {
          lowerBodyExercises++;
        } else if (
          muscleGroup.includes("core") ||
          muscleGroup.includes("abs")
        ) {
          coreExercises++;
        }

        we.exercise_sets.forEach(set => {
          totalSets++;
          totalReps += set.completed_reps || 0;
        });
      });
    });

    // Check conditions based on badge name
    switch (badge.name) {
      case "First Steps":
        return completedWorkouts.length >= 1;

      case "Getting Started":
        return completedWorkouts.length >= 3;

      case "Early Bird":
        return completedWorkouts.some(w => {
          const hour = new Date(w.started_at).getHours();
          return hour < 9;
        });

      case "Night Owl":
        return completedWorkouts.some(w => {
          const hour = new Date(w.started_at).getHours();
          return hour >= 20;
        });

      case "Rep Rookie":
        return totalReps >= 100;

      case "Rep Warrior":
        return totalReps >= 500;

      case "Perfect Form":
        return completedWorkouts.some(w => w.score === 100);

      case "On Fire":
        return this.checkStreak(completedWorkouts, 3);

      case "Consistency King":
        return this.checkStreak(completedWorkouts, 7);

      case "Explorer":
        return exerciseTypes.size >= 5;

      case "Adventurer":
        return exerciseTypes.size >= 10;

      case "Warm Up":
        return completedWorkouts.some(w =>
          w.workout_exercises.every(
            we => (we.exercises?.difficulty_level || 1) <= 2,
          ),
        );

      case "Feeling Strong":
        return completedWorkouts.some(w =>
          w.workout_exercises.some(we => we.exercises?.difficulty_level === 3),
        );

      case "Beast Mode":
        return completedWorkouts.some(w =>
          w.workout_exercises.some(
            we => (we.exercises?.difficulty_level || 0) >= 4,
          ),
        );

      case "Coin Collector":
        return (userData.coins || 0) >= 50;

      case "Treasure Hunter":
        return (userData.coins || 0) >= 100;

      case "Level Up":
        return (userData.level || 1) >= 2;

      case "Rising Star":
        return (userData.level || 1) >= 5;

      case "Weekend Warrior":
        return completedWorkouts.some(w => {
          const day = new Date(w.started_at).getDay();
          return day === 0 || day === 6; // Sunday or Saturday
        });

      case "Monday Motivation":
        return completedWorkouts.some(w => {
          const day = new Date(w.started_at).getDay();
          return day === 1; // Monday
        });

      case "Upper Body Focus":
        return upperBodyExercises >= 5;

      case "Leg Day Legend":
        return lowerBodyExercises >= 5;

      case "Core Crusher":
        return coreExercises >= 5;

      case "Welcome to GainPlay":
        return userData.user_settings !== null;

      case "Avatar Collector":
        return userData.user_avatars.length > 1; // More than default

      case "Social Butterfly":
        return (
          userData.sentFriendRequests.length > 0 ||
          userData.receivedFriendRequests.length > 0
        );

      case "Century Club":
        return totalSets >= 100;

      case "Dedicated":
        return completedWorkouts.length >= 10;

      case "Quick Burn":
        return completedWorkouts.some(w => {
          if (!w.completed_at || !w.started_at) return false;
          const duration =
            new Date(w.completed_at).getTime() -
            new Date(w.started_at).getTime();
          return duration < 15 * 60 * 1000; // 15 minutes
        });

      case "Marathon":
        return completedWorkouts.some(w => {
          if (!w.completed_at || !w.started_at) return false;
          const duration =
            new Date(w.completed_at).getTime() -
            new Date(w.started_at).getTime();
          return duration >= 30 * 60 * 1000; // 30 minutes
        });

      default:
        return false;
    }
  }

  private checkStreak(workouts: any[], requiredDays: number): boolean {
    if (workouts.length === 0) return false;

    // Sort workouts by date
    const sortedWorkouts = workouts
      .filter(w => w.completed_at)
      .sort(
        (a, b) =>
          new Date(b.completed_at).getTime() -
          new Date(a.completed_at).getTime(),
      );

    if (sortedWorkouts.length === 0) return false;

    // Check for consecutive days
    let currentStreak = 1;
    let lastDate = new Date(sortedWorkouts[0].completed_at);
    lastDate.setHours(0, 0, 0, 0);

    for (
      let i = 1;
      i < sortedWorkouts.length && currentStreak < requiredDays;
      i++
    ) {
      const workoutDate = new Date(sortedWorkouts[i].completed_at);
      workoutDate.setHours(0, 0, 0, 0);

      const dayDiff =
        (lastDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24);

      if (dayDiff === 1) {
        currentStreak++;
        lastDate = workoutDate;
      } else if (dayDiff > 1) {
        currentStreak = 1;
        lastDate = workoutDate;
      }
    }

    return currentStreak >= requiredDays;
  }
}
