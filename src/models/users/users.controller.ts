import { users } from "@prisma/client";
import { UsersService } from "@/models/users/users.service";
import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { OnboardingDto } from "./dto/onboarding.dto";

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

  @Get(":email/mail")
  findOneByMail(@Param("email") email: string): Promise<users> {
    return this.usersService.findByEmail(email);
  }

  @Post("onboarding")
  async updateOnboardingData(
    @Req() req,
    @Body() onboardingData: OnboardingDto,
  ) {
    try {
      const userId = req.user.id;
      return await this.usersService.updateOnboardingData(
        userId,
        onboardingData,
      );
    } catch (error) {
      throw new HttpException(
        error.message || "Failed to update onboarding data",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(":userId/badge/:badgeId")
  async addBadgeToUser(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("badgeId", ParseIntPipe) badgeId: number,
  ) {
    return this.usersService.addBadgeToUser(userId, badgeId);
  }
  
  @Post(":userId/updateUser")
  async updateUserSettings(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() userData: any,
  ) {
    return this.usersService.updateUser(userId, userData);
  }
}
