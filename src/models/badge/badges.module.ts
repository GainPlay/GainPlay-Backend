import { Module } from '@nestjs/common';
import { BadgesController } from './badges.controller';
import { BadgesService } from './badges.service';
import { BadgesRepository } from '@/models/badge/badges.repository';
import { PrismaService } from 'database/prisma.service';

@Module({
  controllers: [BadgesController],
  providers: [BadgesService, BadgesRepository, PrismaService],
  exports: [BadgesService],
})
export class BadgesModule {}