import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { decrypt, encrypt } from '~/lib/crypto';
import { randomString } from '~/lib/random';
import { ChannelModelProvider } from '~/mongo/connect/channel.schema';

@Injectable()
export class ChannelService {
  static readonly DEFAULT_PROJECTION = {
    allowedDomains: 1,
    clientId: 1,
    createdAt: 1,
    createdBy: 1,
    customization: 1,
    defaultBotId: 1,
    defaultTeamId: 1,
    description: 1,
    enableFeedback: 1,
    enablePreview: 1,
    isConnected: 1,
    isDefault: 1,
    modifiedBy: 1,
    name: 1,
    socialConfig: 1,
    triggerBot: 1,
    type: 1,
    updatedAt: 1,
    welcomeMessage: 1,
  };

  constructor(
    @Inject(ChannelModelProvider.provide)
    private channelModel: typeof ChannelModelProvider.useValue
  ) {}

  async createDefault(appId: string) {
    const channel = await this.channelModel.create({
      appId: appId,
      clientId: encrypt(randomString(32)),
      description: `Default Web Widget`,
      isConnected: true,
      isDefault: true,
      name: `Default Web Widget`,
      privateKeys: {
        clientSecret: encrypt(randomString(32)),
      },
      type: 'WEB',
      welcomeMessage:
        'Welcome! We appreciate your presence on our site. Should you have any questions or require assistance, please feel free to reach out to us. We aim to assist you promptly.',
    });

    return channel.toObject();
  }

  async list(appId: string) {
    const channels = await this.channelModel
      .find(
        {
          appId: appId,
          status: ['ACTIVE', 'INACTIVE'],
        },
        ChannelService.DEFAULT_PROJECTION
      )
      .lean();

    channels.forEach((channel) => {
      channel.clientId = decrypt(channel.clientId);
    });

    return channels;
  }

  async getByClientId(clientId: string) {
    const channel = await this.channelModel
      .findOne(
        {
          clientId: encrypt(clientId),
          status: 'ACTIVE',
        },
        {
          _id: 0,
          allowedDomains: 1,
          appId: 1,
          customization: 1,
          enablePreview: 1,
        }
      )
      .lean();

    if (!channel) {
      throw new NotFoundException('CHANNEL_NOT_FOUND');
    }

    return channel;
  }
}
