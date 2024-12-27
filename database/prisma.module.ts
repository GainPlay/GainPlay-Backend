import { Module } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";

@Module({
  exports: [PrismaService],
  providers: [PrismaService],
})
export class PrismaModule {}
