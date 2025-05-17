import { Prisma } from "@prisma/client";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { UserBadgesService } from "./user-badges.service";
import { CreateUserBadgeDto } from "./dto/create-user-badge.dto";
import { UpdateUserBadgeDto } from "./dto/update-user-badge.dto";

@Controller("user-badges")
export class UserBadgesController {
  constructor(private readonly userBadgesService: UserBadgesService) {}

  @Get()
  async findAll() {
    return this.userBadgesService.findAll();
  }

  @Get("user/:userId")
  async findByUser(@Param("userId", ParseIntPipe) userId: number) {
    return this.userBadgesService.findByUser(userId);
  }

  @Get("badge/:badgeId")
  async findByBadge(@Param("badgeId", ParseIntPipe) badgeId: number) {
    return this.userBadgesService.findByBadge(badgeId);
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.userBadgesService.findOne(id);
  }

  @Post()
  async create(@Body() createUserBadgeDto: CreateUserBadgeDto) {
    const { user_id, badge_id, earned_at } = createUserBadgeDto;

    const data: Prisma.user_badgesCreateInput = {
      earned_at: earned_at,
      users: user_id ? { connect: { id: user_id } } : undefined,
      badges: badge_id ? { connect: { id: badge_id } } : undefined,
    };

    return this.userBadgesService.create(data);
  }

  @Post("assign")
  @HttpCode(HttpStatus.OK)
  async assignBadge(
    @Query("userId", ParseIntPipe) userId: number,
    @Query("badgeId", ParseIntPipe) badgeId: number,
  ) {
    return this.userBadgesService.assignBadgeToUser(userId, badgeId);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserBadgeDto: UpdateUserBadgeDto,
  ) {
    const { user_id, badge_id, earned_at } = updateUserBadgeDto;

    const data: Prisma.user_badgesUpdateInput = {
      earned_at: earned_at,
      users: user_id ? { connect: { id: user_id } } : undefined,
      badges: badge_id ? { connect: { id: badge_id } } : undefined,
    };

    return this.userBadgesService.update(id, data);
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.userBadgesService.remove(id);
  }
}
