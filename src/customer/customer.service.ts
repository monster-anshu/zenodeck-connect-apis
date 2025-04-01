import { Inject, Injectable } from '@nestjs/common';
import { CustomerModelProvider } from '~/mongo/connect/customer.schema';

@Injectable()
export class CustomerService {
  constructor(
    @Inject(CustomerModelProvider.provide)
    private readonly customerModel: typeof CustomerModelProvider.useValue
  ) {}

  async create() {}
}
