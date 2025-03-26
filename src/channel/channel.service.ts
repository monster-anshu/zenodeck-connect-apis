import { Inject, Injectable } from '@nestjs/common';
import { encrypt } from '~/lib/crypto';
import { randomString } from '~/lib/random';
import { ChannelModelProvider } from '~/mongo/connect/channel.schema';

@Injectable()
export class ChannelService {
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
}
