import { PartialType } from "@nestjs/mapped-types";
import { CreateExampleDto } from "@/models/examples/dto/create-example.dto";

export class UpdateExampleDto extends PartialType(CreateExampleDto) {}
