import { Module } from "@nestjs/common";
import { GeminiService } from "@/models/chat/gemini.service";
import { UserSettingsModule } from "@/models/user_setting/user-settings.module";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";

@Module({
  exports: [ChatService],
  controllers: [ChatController],
  imports: [UserSettingsModule],
  providers: [ChatService, GeminiService],
})
export class ChatModule {}
