import { Module } from '@nestjs/common';
import { CustomFieldModule } from '~/custom-field/custom-field.module';
import { CustomerModelProvider } from '~/mongo/connect/customer.schema';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [CustomFieldModule],
  providers: [CustomerService, CustomerModelProvider],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}
