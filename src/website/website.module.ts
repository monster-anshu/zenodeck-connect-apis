import { Module } from '@nestjs/common';
import { ChannelModule } from '~/channel/channel.module';
import { ChatModule } from '~/chat/chat.module';
import { CustomerModule } from '~/customer/customer.module';
import { WebsiteController } from './website.controller';
import { WebsitePublicController } from './website.public.controller';
import { WebsiteService } from './website.service';

@Module({
  controllers: [WebsiteController, WebsitePublicController],
  providers: [WebsiteService],
  imports: [ChannelModule, CustomerModule, ChatModule],
})
export class WebsiteModule {}
