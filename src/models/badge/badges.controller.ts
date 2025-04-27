import { BadgesService } from '@/models/badge/badges.service';
import { CreateBadgeDto } from '@/models/badge/dto/create-badge.dto';
import { UpdateBadgeDto } from '@/models/badge/dto/update-badge.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get()
  async findAll() {
    return this.badgesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.badgesService.findOne(id);
  }

  @Post()
  async create(@Body() createBadgeDto: CreateBadgeDto) {
    return this.badgesService.create(createBadgeDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBadgeDto: UpdateBadgeDto,
  ) {
    return this.badgesService.update(id, updateBadgeDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.badgesService.remove(id);
  }
}

