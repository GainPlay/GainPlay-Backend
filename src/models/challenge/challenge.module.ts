import { ChallengeController } from "@/models/challenge/challenge.controller";
import { ChallengeRepository } from "@/models/challenge/challenge.repository";
import { ChallengeService } from "@/models/challenge/challenge.service";
import { Module } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";

@Module({
  exports: [ChallengeService, ChallengeController],
  controllers: [ChallengeController],
  providers: [ChallengeController, PrismaService, ChallengeService, ChallengeRepository],
})
export class ChallengeModule {}
