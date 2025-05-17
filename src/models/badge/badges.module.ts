import { Module } from "@nestjs/common";
import { PrismaModule } from "database/prisma.module";
import { PrismaService } from "database/prisma.service";
import { BadgesRepository } from "@/models/badge/badges.repository";
import { BadgesService } from "./badges.service";
import { BadgesController } from "./badges.controller";

@Module({
  imports: [PrismaModule],
  exports: [BadgesService],
  controllers: [BadgesController],
  providers: [BadgesService, BadgesRepository, PrismaService],
})
export class BadgesModule {}
