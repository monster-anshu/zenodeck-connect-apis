import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { ChannelService } from '~/channel/channel.service';
import { ConnectAppService } from '~/connect-app/connect-app.service';

@Injectable()
export class CustomerGuard implements CanActivate {
  constructor(
    private readonly connectAppService: ConnectAppService,
    private readonly channelService: ChannelService
  ) {}

  async canActivate(context: ExecutionContext) {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const session = request.customerSession;

    if (!session) {
      throw new UnauthorizedException();
    }

    const { connectApp, type, customerId } = session || {};
    let { appId, channelId } = connectApp || {};

    if (!appId || !channelId) {
      throw new UnauthorizedException();
    }

    const [appInfo, channel] = await Promise.all([
      this.connectAppService.getById(appId),
      this.channelService.getById(appId, channelId),
    ]);

    if (!appInfo || !channel) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
