import { Module } from "@nestjs/common";
import { ExamplesService } from "@/models/examples/examples.service";
import { ExamplesController } from "@/models/examples/examples.controller";
import { ExamplesRepository } from "@/models/examples/examples.repository";

@Module({
  controllers: [ExamplesController],
  providers: [ExamplesService, ExamplesRepository],
})
export class ExamplesModule {}
