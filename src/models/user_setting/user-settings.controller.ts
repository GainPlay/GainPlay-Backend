import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from "@nestjs/common";
import { UserSettingsService } from "./user-settings.service";
import { CreateUserSettingsDto } from "./dto/create-user-settings.dto";
import { UpdateUserSettingsDto } from "./dto/update-user-settings.dto";

@Controller("user-settings")
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Post()
  create(@Body() createUserSettingsDto: CreateUserSettingsDto) {
    const data = {
      fitness_level: createUserSettingsDto.fitness_level,
      users: { connect: { id: createUserSettingsDto.user_id } },
      exercise_frequency: createUserSettingsDto.exercise_frequency,
    };
    return this.userSettingsService.create(data);
  }

  @Get()
  findAll() {
    return this.userSettingsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.userSettingsService.findOne(id);
  }

  @Get("user/:userId")
  findByUser(@Param("userId", ParseIntPipe) userId: number) {
    return this.userSettingsService.findByUser(userId);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserSettingsDto: UpdateUserSettingsDto,
  ) {
    return this.userSettingsService.update(id, updateUserSettingsDto);
  }

  @Patch("user/:userId")
  updateByUserId(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() updateUserSettingsDto: UpdateUserSettingsDto,
  ) {
    return this.userSettingsService.updateByUserId(
      userId,
      updateUserSettingsDto,
    );
  }

  @Put("user/:userId")
  upsert(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() updateUserSettingsDto: UpdateUserSettingsDto,
  ) {
    return this.userSettingsService.upsert(userId, updateUserSettingsDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.userSettingsService.remove(id);
  }
}
