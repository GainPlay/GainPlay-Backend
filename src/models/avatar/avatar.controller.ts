import { AvatarService } from "@/models/avatar/avatar.service";
import { CreateAvatarDto } from "@/models/avatar/dto/create-avatar-dto";
import { UpdateAvatarDto } from "@/models/avatar/dto/update-avatar.dto";
import { AvatarResponseDto } from "@/models/avatar/dto/avatar-response.dto";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";

@Controller("avatars")
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Post()
  create(@Body() createAvatarDto: CreateAvatarDto): Promise<AvatarResponseDto> {
    return this.avatarService.create(createAvatarDto);
  }

  @Get()
  findAll(): Promise<AvatarResponseDto[]> {
    return this.avatarService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<AvatarResponseDto> {
    return this.avatarService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateAvatarDto: UpdateAvatarDto,
  ): Promise<AvatarResponseDto> {
    return this.avatarService.update(id, updateAvatarDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number): Promise<AvatarResponseDto> {
    return this.avatarService.remove(id);
  }
}
