import { Module } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";
import { UsersService } from "@/models/users/users.service";
import { UsersRepository } from "@/models/users/users.repository";

@Module({
  exports: [UsersService],
  providers: [PrismaService, UsersService, UsersRepository],
})
export class UsersModule {}
