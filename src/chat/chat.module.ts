import { Module } from '@nestjs/common';
import { ChatModelProvider } from '~/mongo/connect/chat.schema';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatModelProvider],
  exports: [ChatService],
})
export class ChatModule {}
