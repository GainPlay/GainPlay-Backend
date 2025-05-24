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
  Req,
} from "@nestjs/common";

@Controller("friendships")
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Post()
  async create(@Body() createFriendshipDto: CreateFriendshipDto) {
    return this.friendshipsService.create(createFriendshipDto);
  }

  @Get()
  async findAll(@Req() req) {
    const userId = req.user.id;
    return this.friendshipsService.findAll(userId);
  }

  @Get("discover")
  async findAllDiscover(@Req() req) {
    const userId = req.user.id;
    return this.friendshipsService.findAllDiscover(userId);
  }

  @Get("friendId/:friendId")
  async findOneByUsers(
    @Req() req,
    @Param("friendId", ParseIntPipe) friendId: number,
  ) {
    const userId = req.user.id;
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
