import { Module } from "@nestjs/common";
import { PrismaModule } from "database/prisma.module";
import { FriendshipsService } from "@/models/friendships/friendships.service";
import { FriendshipsController } from "@/models/friendships/friendships.controller";
import { FriendshipsRepository } from "@/models/friendships/friendships.repository";

@Module({
  imports: [PrismaModule],
  exports: [FriendshipsService],
  controllers: [FriendshipsController],
  providers: [FriendshipsService, FriendshipsRepository],
})
export class FriendshipsModule {}
