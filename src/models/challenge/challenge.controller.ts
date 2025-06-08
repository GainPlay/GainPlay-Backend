import { Challenge } from "@/models/challenge/type";
import { ChallengeService } from "@/models/challenge/challenge.service";
import { Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";

@Controller("daily-challenge")
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Get()
  async getTodaysChallenge(): Promise<Challenge> {
    console.log('heyyyyyyyyyyyy')
    const b = await this.challengeService.getTodaysChallenge();
    console.log({ b })
    return b
  }

  @Post("complete/:userId")
  async completeDailyChallenge(@Param("userId", ParseIntPipe) userId: number) {
    console.log({ hila: userId });
    return await this.challengeService.completeDailyChallenge(userId);
  }
}
