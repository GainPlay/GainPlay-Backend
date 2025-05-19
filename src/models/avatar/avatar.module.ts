import { Module } from "@nestjs/common";
import { PrismaModule } from "database/prisma.module";
import { AvatarService } from "@/models/avatar/avatar.service";
import { AvatarRepository } from "@/models/avatar/avatar.repository";
import { AvatarsController } from "@/models/avatar/avatar.controller";

@Module({
  imports: [PrismaModule],
  exports: [AvatarService],
  controllers: [AvatarsController],
  providers: [AvatarService, AvatarRepository],
})
export class AvatarModule {}
