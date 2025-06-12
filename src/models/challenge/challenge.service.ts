import { Injectable } from "@nestjs/common";
import { Challenge } from "@/models/challenge/type";
import { ChallengeRepository } from "@/models/challenge/challenge.repository";
import { calculateLevel } from "@/models/workout/utils/workoutUtils";

@Injectable()
export class ChallengeService {
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async getTodaysChallenge(): Promise<Challenge> {
    return await this.challengeRepository.getTodaysChallenge();
  }

  async completeDailyChallenge(userId: number) {
    const user = await this.challengeRepository.findOneById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const coinsGain = 50;
    const newCoins = user.coins + coinsGain;
    const newTotalExperience = (user.experience || 0) + 100;
    
    // Calculate new level
    const levelInfo = calculateLevel(newTotalExperience);
    const newLevel = levelInfo.level || 1;
    
    const updatedUser = await this.challengeRepository.updateUserAfterChallenge(
      userId,
      newCoins,
      newLevel
    );

    return {
      user: updatedUser,
      message: "Challenge completed!",
    };
  }
}
