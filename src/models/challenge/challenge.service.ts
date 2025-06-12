import { Injectable } from "@nestjs/common";
import { Challenge } from "@/models/challenge/type";
import { ChallengeRepository } from "@/models/challenge/challenge.repository";

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
    const newTotalExperience = (user.experience || 0) + 10;

    // Calculate new level
    const newLevel = Math.floor(newTotalExperience / 100) || 1;

    const updatedUser = await this.challengeRepository.updateUserAfterChallenge(
      userId,
      newCoins,
      newLevel,
    );

    return {
      user: updatedUser,
      message: "Challenge completed!",
    };
  }
}
