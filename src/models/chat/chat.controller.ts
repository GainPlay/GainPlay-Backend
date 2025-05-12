import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageRequestDto } from './dto/message-request.dto';
import { MessageResponseDto } from './dto/message-response.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(@Body() messageDto: MessageRequestDto): Promise<MessageResponseDto> {
    try {
      if (!messageDto.message || typeof messageDto.message !== 'string') {
        throw new HttpException('Message is required and must be a string', HttpStatus.BAD_REQUEST);
      }
      
      return await this.chatService.processMessage(messageDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to process message', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
