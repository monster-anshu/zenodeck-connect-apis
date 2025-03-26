import { Controller, Get, Param, Req } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { ChannelService } from '~/channel/channel.service';

@Controller('website/:clientId')
export class WebsitePublicController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  async getWebWidgetSettings(
    @Param('clientId') clientId: string,
    @Req() req: FastifyRequest
  ) {
    const channel = await this.channelService.getByClientId(clientId);
    const meta = {
      country: req.headers['cloudfront-viewer-country-name'] || '',
      countryCode: req.headers['cloudfront-viewer-country'] || '',
    };

    return {
      channel,
      meta,
    };
  }
}
