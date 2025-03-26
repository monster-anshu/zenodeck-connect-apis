import { Module } from '@nestjs/common';
import { ChannelModelProvider } from '~/mongo/connect/channel.schema';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService, ChannelModelProvider],
  exports: [ChannelService],
})
export class ChannelModule {}
