import { Module } from '@nestjs/common';
import { CustomerModelProvider } from '~/mongo/connect/customer.schema';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  providers: [CustomerService, CustomerModelProvider],
  controllers: [CustomerController],
})
export class CustomerModule {}
