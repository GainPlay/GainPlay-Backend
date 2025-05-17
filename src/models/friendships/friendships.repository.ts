import { PrismaService } from "database/prisma.service";
import { Prisma, friendships, users } from "@prisma/client";
import { SELECTION_FIELDS } from "@/models/friendships/constants/friendship.consts";
import { UpdateFriendshipDto } from "@/models/friendships/dto/update-friendship.dto";
import { CreateFriendshipDto } from "@/models/friendships/dto/create-friendship.dto";
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";

@Injectable()
export class FriendshipsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFriendshipDto: CreateFriendshipDto): Promise<friendships> {
    try {
      return await this.prisma.friendships.create({
        data: createFriendshipDto,
        include: {
          sender: {
            select: {
              ...SELECTION_FIELDS,
              user_goals: {
                select: {
                  goals: true,
                },
              },
            },
          },
          receiver: {
            select: {
              ...SELECTION_FIELDS,
              user_goals: {
                select: {
                  goals: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException(
          "Friendship already exists between these users.",
        );
      }
      throw error;
    }
  }

  async findAll(userId: number): Promise<friendships[]> {
    return this.prisma.friendships.findMany({
      where: {
        OR: [{ user_id: userId }, { friend_id: userId }],
      },
      include: {
        sender: {
          select: {
            ...SELECTION_FIELDS,
            user_goals: {
              select: {
                goals: true,
              },
            },
          },
        },
        receiver: {
          select: {
            ...SELECTION_FIELDS,
            user_goals: {
              select: {
                goals: true,
              },
            },
          },
        },
      },
    });
  }

  async findAllDiscover(userId: number): Promise<Partial<users>[]> {
    return this.prisma.users.findMany({
      select: {
        ...SELECTION_FIELDS,
        coins: true,
        user_goals: {
          select: {
            goals: true,
          },
        },
      },
      where: {
        id: {
          not: userId, // Don't include the current user
        },
        AND: [
          {
            // Exclude users where current user is the sender in an accepted friendship
            receivedFriendRequests: {
              none: {
                user_id: userId,
                status: "accepted",
              },
            },
          },
          {
            // Exclude users where current user is the receiver in an accepted friendship
            sentFriendRequests: {
              none: {
                friend_id: userId,
                status: "accepted",
              },
            },
          },
        ],
      },
    });
  }

  async findOneByUsers(
    user_id: number,
    friend_id: number,
  ): Promise<friendships | null> {
    return this.prisma.friendships.findUnique({
      where: {
        user_id_friend_id: {
          user_id,
          friend_id,
        },
      },
      include: {
        sender: {
          select: {
            ...SELECTION_FIELDS,
            user_goals: {
              select: {
                goals: true,
              },
            },
          },
        },
        receiver: {
          select: {
            ...SELECTION_FIELDS,
            user_goals: {
              select: {
                goals: true,
              },
            },
          },
        },
      },
    });
  }

  async update(
    id: number,
    updateFriendshipDto: UpdateFriendshipDto,
  ): Promise<friendships> {
    try {
      return await this.prisma.friendships.update({
        where: {
          id: id,
        },
        data: {
          status: updateFriendshipDto.status,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundException("Friendship not found for update");
      }
      throw error;
    }
  }

  async remove(id: number): Promise<friendships> {
    try {
      return await this.prisma.friendships.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundException(`Friendship with ID ${id} not found`);
      }
      throw error;
    }
  }
}
