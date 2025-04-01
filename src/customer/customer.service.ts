import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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

  async update(
    appId: string,
    customerId: string,
    fields: Record<string, string> & { emailId?: string }
  ) {
    const customer = await this.customerModel
      .findOneAndUpdate(
        {
          _id: customerId,
          appId: appId,
          status: 'ACTIVE',
        },
        {
          $set: {
            fields,
          },
        },
        {
          new: true,
        }
      )
      .lean();

    if (!customer) {
      throw new NotFoundException('CUSTOMER_NOT_FOUND');
    }

    return customer;
  }

  async getById(appId: string, customerId: string) {
    const customer = await this.customerModel
      .findOne({
        appId: appId,
        _id: customerId,
        status: 'ACTIVE',
      })
      .lean();

    if (!customer) {
      throw new NotFoundException('CUSTOMER_NOT_FOUND');
    }

    return customer;
  }
}
