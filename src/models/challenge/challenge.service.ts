import { ChallengeRepository } from "@/models/challenge/challenge.repository";
import { Challenge } from "@/models/challenge/type";
import { UsersRepository } from "@/models/users/users.repository";
import { UpdateWorkoutDto } from "@/models/workout/dto/updateWorkoutDto";
import { calcWorkoutCoins } from "@/models/workout/utils/workoutUtils";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";

@Injectable()
export class ChallengeService {
  constructor(
    private prisma: PrismaService,
    private readonly challengeRepository: ChallengeRepository,
    private readonly usersRepository: UsersRepository
  ) { }

  async getTodaysChallenge(): Promise<Challenge> {
    return await this.challengeRepository.getTodaysChallenge();
  }

  async completeDailyChallenge(userId: number) {
    const user = await this.challengeRepository.findOneById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const coinsGain = 50;
    const newCoins = user.coins + coinsGain;

    const updatedUser = await this.challengeRepository.updateUserAfterChallenge(userId, newCoins);

    return {
      message: 'Challenge completed!',
      coinsGained: coinsGain,
      user: updatedUser,
    };
  }
}
