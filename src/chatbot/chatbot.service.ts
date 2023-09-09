import { Injectable } from '@nestjs/common';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';

@Injectable()
export class ChatbotService {
  getRecommendations(message: string): string[] {
     if (message.includes('headache')) {
      return ['Did you drink enough water?', 'How long has the headache lasted?', 'Do you have other symptoms?'];
    }
    return ['Can you provide more details?'];
  }
}
