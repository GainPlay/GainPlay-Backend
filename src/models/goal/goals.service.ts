import { Injectable } from "@nestjs/common";
import { CreateExampleDto } from "@/models/examples/dto/create-example.dto";
import { UpdateExampleDto } from "@/models/examples/dto/update-example.dto";
import { GoalsRepository } from './goals.repository';

@Injectable()
export class GoalsService {
constructor(private readonly goalsRepository: GoalsRepository) {}

  findAll() {
    return this.goalsRepository.findAll();
  }
}
