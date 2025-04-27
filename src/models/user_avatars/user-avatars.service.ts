import { user_avatars } from "@prisma/client";
import { UsersService } from "@/models/users/users.service";
import { UserAvatarsRepository } from "@/models/user_avatars/user-avatars.repository";
import { CreateUserAvatarDto } from "@/models/user_avatars/dto/user-avatars-create.dto";
import { UpdateUserAvatarDto } from "@/models/user_avatars/dto/user-avatars-update.dto";
import { UserAvatarResponseDto } from "@/models/user_avatars/dto/user-avatars-response.dto";
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";

@Injectable()
export class UserAvatarsService {
  constructor(
    private readonly userAvatarsRepository: UserAvatarsRepository,
    private readonly usersService: UsersService,
    private readonly avatarsService: UserAvatarsService,
  ) {}

  async findAll(): Promise<UserAvatarResponseDto[]> {
    const userAvatars = await this.userAvatarsRepository.findAll();
    return userAvatars.map(ua => this.toResponseDto(ua));
  }

  async findOneById(id: number): Promise<UserAvatarResponseDto> {
    const userAvatar = await this.userAvatarsRepository.findOneById(id);
    if (!userAvatar) {
      throw new NotFoundException(`User Avatar with ID ${id} not found`);
    }
    return this.toResponseDto(userAvatar);
  }

  async findByUserId(userId: number): Promise<UserAvatarResponseDto[]> {
    // Verify user exists
    await this.usersService.findById(userId);

    const userAvatars = await this.userAvatarsRepository.findByUserId(userId);
    return userAvatars.map(ua => this.toResponseDto(ua));
  }

  async findCurrentByUserId(
    userId: number,
  ): Promise<UserAvatarResponseDto | null> {
    // Verify user exists
    await this.usersService.findById(userId);

    const currentAvatar =
      await this.userAvatarsRepository.findCurrentByUserId(userId);
    return currentAvatar ? this.toResponseDto(currentAvatar) : null;
  }

  async create(dto: CreateUserAvatarDto): Promise<UserAvatarResponseDto> {
    // Verify user exists
    await this.usersService.findById(dto.user_id);

    // Verify avatar exists
    await this.avatarsService.findOneById(dto.avatar_id);

    // Check if user already has this avatar
    const userAvatars = await this.userAvatarsRepository.findByUserId(
      dto.user_id,
    );
    const existingAvatar = userAvatars.find(
      ua => ua.avatar_id === dto.avatar_id,
    );

    if (existingAvatar) {
      throw new ConflictException(`User already has this avatar`);
    }

    const userAvatar = await this.userAvatarsRepository.create(dto);
    return this.toResponseDto(userAvatar);
  }

  async update(
    id: number,
    dto: UpdateUserAvatarDto,
  ): Promise<UserAvatarResponseDto> {
    await this.findOneById(id); // Verify user avatar exists

    const updatedUserAvatar = await this.userAvatarsRepository.update(id, dto);
    return this.toResponseDto(updatedUserAvatar);
  }

  async setCurrentAvatar(
    userId: number,
    avatarId: number,
  ): Promise<UserAvatarResponseDto> {
    // Find the user avatar record
    const userAvatars = await this.userAvatarsRepository.findByUserId(userId);
    const userAvatar = userAvatars.find(ua => ua.avatar_id === avatarId);

    if (!userAvatar) {
      throw new NotFoundException(`User does not own this avatar`);
    }

    const updatedUserAvatar = await this.userAvatarsRepository.update(
      userAvatar.id,
      { is_current: true },
    );
    return this.toResponseDto(updatedUserAvatar);
  }

  async delete(id: number): Promise<UserAvatarResponseDto> {
    const userAvatar = await this.findOneById(id); // Verify user avatar exists

    // If it's the current avatar, prevent deletion or handle accordingly
    if (userAvatar.is_current) {
      throw new BadRequestException(
        `Cannot delete the current avatar. Set another avatar as current first.`,
      );
    }

    const deletedUserAvatar = await this.userAvatarsRepository.delete(id);
    return this.toResponseDto(deletedUserAvatar);
  }

  private toResponseDto(
    userAvatar: user_avatars & { avatars?: any },
  ): UserAvatarResponseDto {
    return {
      id: userAvatar.id,
      user_id: userAvatar.user_id,
      avatar_id: userAvatar.avatar_id,
      is_current: userAvatar.is_current,
      purchased_at: userAvatar.purchased_at,
      avatar: userAvatar.avatars
        ? {
            id: userAvatar.avatars.id,
            name: userAvatar.avatars.name,
            price: userAvatar.avatars.price,
            image_url: userAvatar.avatars.image_url,
          }
        : undefined,
    };
  }
}
