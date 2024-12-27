import { AppService } from "@/app.service";
import { Public } from "@/auth/decorators";
import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  healthCheck() {
    return this.appService.healthCheck();
  }
}
