import { Injectable } from '@nestjs/common';
import { MessageRequestDto } from './dto/message-request.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { GeminiService } from '@/models/chat/gemini.service';

@Injectable()
export class ChatService {
    constructor(private geminiService: GeminiService) {}
  /**
   * Process a user message and prepare for AI response
   * @param messageDto The message sent by the user
   * @returns A response with a placeholder (to be replaced with actual AI processing)
   */
  async processMessage(messageDto: MessageRequestDto): Promise<MessageResponseDto> {
     const chatAnswer = await this.geminiService.generateAnswer(messageDto);

    
    return {
      answer: chatAnswer,
      timestamp: new Date().toISOString(),
    };
  }
}
