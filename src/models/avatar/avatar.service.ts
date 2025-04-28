import { Injectable, NotFoundException } from "@nestjs/common";
import { AvatarRepository } from "@/models/avatar/avatar.repository";
import { CreateAvatarDto } from "@/models/avatar/dto/create-avatar-dto";
import { UpdateAvatarDto } from "@/models/avatar/dto/update-avatar.dto";
import { AvatarResponseDto } from "@/models/avatar/dto/avatar-response.dto";

@Injectable()
export class AvatarService {
  constructor(private repository: AvatarRepository) {}

  async findAll(): Promise<AvatarResponseDto[]> {
    return this.repository.findAll();
  }

  async findOne(id: number): Promise<AvatarResponseDto> {
    const avatar = await this.repository.findOne(id);
    if (!avatar) {
      throw new NotFoundException(`Avatar with ID ${id} not found`);
    }
    return avatar;
  }

  async create(data: CreateAvatarDto): Promise<AvatarResponseDto> {
    return this.repository.create(data);
  }

  async update(id: number, data: UpdateAvatarDto): Promise<AvatarResponseDto> {
    await this.findOne(id); // Verify avatar exists
    return this.repository.update(id, data);
  }

  async remove(id: number): Promise<AvatarResponseDto> {
    await this.findOne(id); // Verify avatar exists
    return this.repository.remove(id);
  }
}
