import { FriendshipsService } from "@/models/friendships/friendships.service";
import { CreateFriendshipDto } from "@/models/friendships/dto/create-friendship.dto";
import { UpdateFriendshipDto } from "@/models/friendships/dto/update-friendship.dto";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from "@nestjs/common";

@Controller("friendships")
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Post()
  async create(@Body() createFriendshipDto: CreateFriendshipDto) {
    return this.friendshipsService.create(createFriendshipDto);
  }

  @Get()
  async findAll(@Query("userId", ParseIntPipe) userId: number) {
    return this.friendshipsService.findAll(userId);
  }

  @Get("discover")
  async findAllDiscover(@Query("userId", ParseIntPipe) userId: number) {
    return this.friendshipsService.findAllDiscover(userId);
  }

  @Get("userId/:userId/friendId/:friendId")
  async findOneByUsers(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("friendId", ParseIntPipe) friendId: number,
  ) {
    return this.friendshipsService.findOneByUsers(userId, friendId);
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateFriendshipDto: UpdateFriendshipDto,
  ) {
    return this.friendshipsService.update(id, updateFriendshipDto);
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.friendshipsService.remove(id);
  }
}
