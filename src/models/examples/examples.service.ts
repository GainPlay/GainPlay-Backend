import { Injectable } from "@nestjs/common";
import { CreateExampleDto } from "@/models/examples/dto/create-example.dto";
import { UpdateExampleDto } from "@/models/examples/dto/update-example.dto";

@Injectable()
export class ExamplesService {
  create(createExampleDto: CreateExampleDto) {
    return `This action adds a new example - ${createExampleDto}`;
  }

  findAll() {
    return `This action returns all examples`;
  }

  findOne(id: number) {
    return `This action returns a #${id} example`;
  }

  update(id: number, updateExampleDto: UpdateExampleDto) {
    return `This action updates a #${id} example - ${updateExampleDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} example`;
  }
}
