import { Module } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";
import { UsersService } from "./users.service";

@Module({
  exports: [UsersService],
  providers: [PrismaService, UsersService],
})
export class UsersModule {}
