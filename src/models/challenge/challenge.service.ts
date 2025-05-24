import { ChallengeRepository } from "@/models/challenge/challenge.repository";
import { Challenge } from "@/models/challenge/type";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ChallengeService {
  constructor(
    private readonly challengeRepository: ChallengeRepository,
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
      user: updatedUser,
    };
  }
}
