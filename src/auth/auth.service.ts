import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { users as User } from "@prisma/client";
import { AccessToken } from "@/auth/interfaces";
import { UsersService } from "@/models/users/users.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { RegisterRequestDto } from "./dtos/register-request.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException("User not found");
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      throw new BadRequestException("Password does not match");
    }
    return user;
  }

  async login(user: User): Promise<AccessToken> {
    const payload = { id: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(user: RegisterRequestDto): Promise<AccessToken> {
    // Check if the user already exists
    const existingUser = await this.usersService.findByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException("email already exists");
    }
    const hashedPassword = await bcrypt.hash(user.password_hash, 10);
    const newUser: User = {
      ...user,
      id: 0,
      coins: 0,
      level: 0,
      experience: 0,
      avatar_url: "",
      created_at: undefined,
      password_hash: hashedPassword,
    };
    await this.usersService.createUser(newUser);
    return this.login(newUser);
  }
}
