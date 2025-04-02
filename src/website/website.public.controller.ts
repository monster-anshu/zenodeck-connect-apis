import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { ChannelService } from '~/channel/channel.service';
import { GetSession } from '~/session/session.decorator';
import { InitiateWebsiteChatDto } from './dto/website-chat-initiate.dto';
import { WebsiteService } from './website.service';

@Controller('website/:clientId')
export class WebsitePublicController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly websiteService: WebsiteService
  ) {}

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

  @Post('chat/initiate')
  async initiateCustomerChat(
    @Param('clientId') clientId: string,
    @Body() body: InitiateWebsiteChatDto,
    @GetSession('customerId') customerId?: string
  ) {
    const { customer, token, chat } = await this.websiteService.initiateChat(
      clientId,
      body,
      customerId
    );

    return {
      isSuccess: true,
      authToken: token,
      chat: chat,
      customer: {
        _id: customer._id,
        ...customer.fields,
      },
    };
  }
}
