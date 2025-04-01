import { Inject, Injectable } from '@nestjs/common';
import { CustomerModelProvider } from '~/mongo/connect/customer.schema';

@Injectable()
export class CustomerService {
  constructor(
    @Inject(CustomerModelProvider.provide)
    private readonly customerModel: typeof CustomerModelProvider.useValue
  ) {}

  async create(
    appId: string,
    channelId: string,
    fields: Record<string, string> & { emailId?: string }
  ) {
    const customer = await this.customerModel.create({
      appId: appId,
      channelId: channelId,
      source: 'WEB',
      fields,
    });

    return customer.toObject();
  }
}
