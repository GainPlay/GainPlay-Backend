import { Public } from "src/auth/decorators";
import {
  Get,
  Controller,
} from "@nestjs/common";
import { GoalsService } from "./goals.service";

@Controller("goals")
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Public()
  @Get()
  findAll() {
    return this.goalsService.findAll();
  }
}
