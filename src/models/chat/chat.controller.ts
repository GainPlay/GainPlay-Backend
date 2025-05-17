import { Controller, Post, Body } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { MessageRequestDto } from "./dto/message-request.dto";
import { MessageResponseDto } from "./dto/message-response.dto";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(
    @Body() messageDto: MessageRequestDto,
  ): Promise<MessageResponseDto> {
    return await this.chatService.processMessage(messageDto);
  }
}
