import { GeminiService } from "@/models/user_goal/gemini.service";
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
import { UserGoalsService } from "./user-goals.service";
import { CreateUserGoalDto } from "./dto/create-user-goal.dto";
import { UpdateUserGoalDto } from "./dto/update-user-goal.dto";
import { UpdateUserGoalValueDto } from "./dto/update-user-goal-value.dto";

@Controller("user-goals")
export class UserGoalsController {
  constructor(
    private readonly userGoalsService: UserGoalsService,
    private geminiService: GeminiService,
  ) {}

  @Post()
  create(@Body() createUserGoalDto: CreateUserGoalDto) {
    return this.userGoalsService.create(createUserGoalDto);
  }

  @Get()
  findAll() {
    return this.userGoalsService.findAll();
  }

  @Get("user/insights")
  async getHealthInsights(@Req() req) {
    const insights = await this.userGoalsService.getHealthInsights(req.user.id);
    return { insights };
  }

  @Get("user/:userId")
  findByUser(@Param("userId", ParseIntPipe) userId: number) {
    return this.userGoalsService.findByUser(userId);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.userGoalsService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserGoalDto: UpdateUserGoalDto,
  ) {
    return this.userGoalsService.update(id, updateUserGoalDto);
  }

  @Patch(":id/value")
  updateValue(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserGoalValueDto: UpdateUserGoalValueDto,
  ) {
    return this.userGoalsService.updateValue(id, updateUserGoalValueDto.value);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.userGoalsService.remove(id);
  }
}
