import { BadgesService } from "@/models/badge/badges.service";
import { CreateBadgeDto } from "@/models/badge/dto/create-badge.dto";
import { UpdateBadgeDto } from "@/models/badge/dto/update-badge.dto";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
} from "@nestjs/common";

@Controller("badges")
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get()
  async findAll() {
    return this.badgesService.findAll();
  }

  @Get("user")
  async getUserBadges(@Req() req) {
    const userId = req.user.id;
    return this.badgesService.getUserBadges(userId);
  }

  @Post("check")
  async checkAndAwardBadges(@Req() req) {
    const userId = req.user.id;
    const newBadges = await this.badgesService.checkAndAwardBadges(userId);
    return {
      newBadges,
      success: true,
      message:
        newBadges.length > 0
          ? `Congratulations! You earned ${newBadges.length} new badge(s)!`
          : "No new badges earned",
    };
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.badgesService.findOne(id);
  }

  @Post()
  async create(@Body() createBadgeDto: CreateBadgeDto) {
    return this.badgesService.create(createBadgeDto);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateBadgeDto: UpdateBadgeDto,
  ) {
    return this.badgesService.update(id, updateBadgeDto);
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.badgesService.remove(id);
  }
}
