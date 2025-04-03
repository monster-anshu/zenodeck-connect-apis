import { Module } from '@nestjs/common';
import { ActivityModule } from '~/activity/activity.module';
import { ChatModelProvider } from '~/mongo/connect/chat.schema';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [ActivityModule],
  controllers: [ChatController],
  providers: [ChatService, ChatModelProvider],
  exports: [ChatService],
})
export class ChatModule {}
