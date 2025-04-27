// First, let's create a badges module
// src/badges/badges.module.ts
import { Module } from '@nestjs/common';
import { BadgesController } from './badges.controller';
import { BadgesService } from '@/models/badge/badges.service';
import { PrismaService } from 'database/prisma.service';

@Module({
  controllers: [BadgesController],
  providers: [BadgesService, PrismaService],
  exports: [BadgesService],
})
export class BadgesModule {}