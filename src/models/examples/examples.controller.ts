import { Public } from "src/auth/decorators";
import { CreateExampleDto } from "@/models/examples/dto/create-example.dto";
import { UpdateExampleDto } from "@/models/examples/dto/update-example.dto";
import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from "@nestjs/common";
import { ExamplesService } from "./examples.service";

@Controller("examples")
export class ExamplesController {
  constructor(private readonly examplesService: ExamplesService) {}

  @Post()
  create(@Body() createExampleDto: CreateExampleDto) {
    return this.examplesService.create(createExampleDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.examplesService.findAll();
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.examplesService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateExampleDto: UpdateExampleDto) {
    return this.examplesService.update(+id, updateExampleDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.examplesService.remove(+id);
  }
}
