import { users } from "@prisma/client";
import { UsersService } from "@/models/users/users.service";
import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";

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
}
