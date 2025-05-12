import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { GeminiService } from '@/models/chat/gemini.service';
import { UserSettingsModule } from '@/models/user_setting/user-settings.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService,GeminiService],
    exports: [ChatService],
    imports: [UserSettingsModule]
})
export class ChatModule {}
