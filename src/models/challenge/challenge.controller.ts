import { ChallengeService } from "@/models/challenge/challenge.service";
import { Challenge } from "@/models/challenge/type";
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post
} from "@nestjs/common";

@Controller("daily-challenge")
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Get()
  async getTodaysChallenge(): Promise<Challenge> {
    return await this.challengeService.getTodaysChallenge();
  }

  @Post('complete/:userId')
  async completeDailyChallenge(
    @Param("userId", ParseIntPipe) userId: number,
  ) {
    return await this.challengeService.completeDailyChallenge(userId);
  }
}
