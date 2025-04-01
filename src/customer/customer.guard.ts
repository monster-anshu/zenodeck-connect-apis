import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { ChannelService } from '~/channel/channel.service';
import { ConnectAppService } from '~/connect-app/connect-app.service';
import { CustomerService } from './customer.service';

@Injectable()
export class CustomerGuard implements CanActivate {
  constructor(
    private readonly connectAppService: ConnectAppService,
    private readonly channelService: ChannelService,
    private readonly customerService: CustomerService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const session = request.customerSession;
    if (!session) {
      throw new UnauthorizedException();
    }

    const { connectApp, customerId } = session || {};
    let { appId, channelId } = connectApp || {};

    if (!appId || !channelId || !customerId) {
      throw new UnauthorizedException();
    }

    const [appInfo, channel] = await Promise.all([
      this.connectAppService.getById(appId),
      this.channelService.getById(appId, channelId),
    ]);

    if (!appInfo || !channel) {
      throw new UnauthorizedException();
    }

    const customer = await this.customerService.getById(
      appInfo._id.toString(),
      customerId
    );

    if (!customer) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
