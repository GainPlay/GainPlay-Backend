import { BadgesRepository } from '@/models/badge/badges.repository';
import { Injectable } from '@nestjs/common';
import { badges, Prisma } from '@prisma/client';

@Injectable()
export class BadgesService {
  constructor(private badgesRepository: BadgesRepository) {}

  async findAll(): Promise<badges[]> {
    return this.badgesRepository.findAll();
  }

  async findOne(id: number): Promise<badges | null> {
    return this.badgesRepository.findOne(id);
  }

  async create(data: Prisma.badgesCreateInput): Promise<badges> {
    return this.badgesRepository.create(data);
  }

  async update(id: number, data: Prisma.badgesUpdateInput): Promise<badges> {
    return this.badgesRepository.update(id, data);
  }

  async remove(id: number): Promise<badges> {
    return this.badgesRepository.remove(id);
  }
}

