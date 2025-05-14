import { users } from "@prisma/client";
import { UsersService } from "@/models/users/users.service";
import { Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<users[]> {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<users> {
    return this.usersService.findById(id);
  }

  @Post(":userId/badge/:badgeId")
  async addBadgeToUser(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("badgeId", ParseIntPipe) badgeId: number,
  ) {
    return this.usersService.addBadgeToUser(userId, badgeId);
  }
}
