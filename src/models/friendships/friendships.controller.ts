import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { CreateFriendshipDto } from "@/models/friendships/dto/create-friendship.dto";
import { UpdateFriendshipDto } from "@/models/friendships/dto/update-friendship.dto";
import { FriendshipsService } from "@/models/friendships/friendships.service";

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

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.friendshipsService.findOne(id);
  }

  @Patch("")
  async update(@Body() updateFriendshipDto: UpdateFriendshipDto) {
    return this.friendshipsService.update(updateFriendshipDto);
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.friendshipsService.remove(id);
  }
}
