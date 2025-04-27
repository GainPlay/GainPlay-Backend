import { Injectable } from "@nestjs/common";
import { GoalsRepository } from "./goals.repository";

@Injectable()
export class GoalsService {
  constructor(private readonly goalsRepository: GoalsRepository) {}

  findAll() {
    return this.goalsRepository.findAll();
  }
}
