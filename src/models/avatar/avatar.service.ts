import { Injectable, NotFoundException } from "@nestjs/common";
import { AvatarRepository } from "./avatar.repository";
import { CreateAvatarDto } from "./dto/create-avatar.dto";
import { UpdateAvatarDto } from "./dto/update-avatar.dto";
import { AvatarResponseDto } from "./dto/avatar-response.dto";

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

  async assignDefaultAvatarToUser(userId: number) {
    const defaultAvatar = await this.repository.findByName("Default Avatar");
    if (!defaultAvatar) {
      throw new NotFoundException("Default avatar not found");
    }

    const existingUserAvatar = await this.repository.findUserAvatar(
      userId,
      defaultAvatar.id,
    );
    if (!existingUserAvatar) {
      await this.repository.updateAllUserAvatars(userId, { is_current: false });
      await this.repository.createUserAvatar(userId, defaultAvatar.id, true);
    }

    return defaultAvatar;
  }

  async getUserAvatars(userId: number) {
    return this.repository.getUserAvatars(userId);
  }

  async purchaseAvatar(userId: number, avatarId: number) {
    const avatar = await this.repository.findOne(avatarId);
    if (!avatar) {
      throw new NotFoundException("Avatar not found");
    }

    const existingUserAvatar = await this.repository.findUserAvatar(
      userId,
      avatarId,
    );
    if (existingUserAvatar) {
      throw new Error("You already own this avatar");
    }

    const user = await this.repository.findUser(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.coins < avatar.price) {
      throw new Error("Not enough coins to purchase this avatar");
    }

    return this.repository.executeTransaction(async () => {
      const updatedUser = await this.repository.updateUser(userId, {
        coins: { decrement: avatar.price },
      });

      const userAvatar = await this.repository.createUserAvatar(
        userId,
        avatarId,
        false,
      );

      return {
        userAvatar,
        success: true,
        remainingCoins: updatedUser.coins,
      };
    });
  }

  async setCurrentAvatar(userId: number, avatarId: number) {
    const userAvatar = await this.repository.findUserAvatar(userId, avatarId);
    if (!userAvatar) {
      throw new NotFoundException("You do not own this avatar");
    }

    await this.repository.updateAllUserAvatars(userId, { is_current: false });
    await this.repository.updateUserAvatar(userAvatar.id, { is_current: true });

    return { success: true };
  }
}
