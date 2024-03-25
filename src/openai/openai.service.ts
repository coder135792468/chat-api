import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { IChatRequest, IChatResponse } from './interfaces';

@Injectable()
export class OpenaiService {
  private openAiService: OpenAI;
  constructor(private configService: ConfigService) {
    this.openAiService = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async getMessagesData(request: IChatRequest): Promise<OpenAI.ChatCompletion> {
    return this.openAiService.chat.completions.create({
      model: this.configService.get('OPENAI_API_MODEL'),
      messages: request.messages,
    });
  }
  async generateImage(prompt: string) {
    const image = await this.openAiService.images.generate({
      model: 'dall-e-2',
      prompt: prompt,
      n: 1,
    });

    return image.data;
  }

  getChatOpenaiResponse(message: OpenAI.ChatCompletion): IChatResponse {
    return {
      success: true,
      result: message?.choices?.length && message?.choices[0],
    };
  }
}
