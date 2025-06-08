import { ChallengeRepository } from "@/models/challenge/challenge.repository";
import { Challenge } from "@/models/challenge/type";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ChallengeService {
  constructor(
    private readonly challengeRepository: ChallengeRepository,
  ) { }

  async getTodaysChallenge(): Promise<Challenge> {
    const a = await this.challengeRepository.getTodaysChallenge();
      console.log({a})
return a 
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
