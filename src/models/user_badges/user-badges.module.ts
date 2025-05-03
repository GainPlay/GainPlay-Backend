import { Module } from '@nestjs/common';
import { UserBadgesService } from './user-badges.service';
import { UserBadgesRepository } from './user-badges.repository';
import { PrismaService } from 'database/prisma.service';
import { UserBadgesController } from '@/models/user_badges/user-badges.controller';

@Module({
  controllers: [UserBadgesController],
  providers: [UserBadgesService, UserBadgesRepository, PrismaService],
  exports: [UserBadgesService],
})
export class UserBadgesModule {}