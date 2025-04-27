import { Module } from "@nestjs/common";
import { PrismaModule } from "database/prisma.module";
import { AvatarService } from "@/models/avatar/avatar.service";
import { AvatarController } from "@/models/avatar/avatar.controller";
import { AvatarRepository } from "@/models/avatar/avatar.repository";

@Module({
  imports: [PrismaModule],
  exports: [AvatarService],
  controllers: [AvatarController],
  providers: [AvatarService, AvatarRepository],
})
export class AvatarModule {}
