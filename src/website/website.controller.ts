import { Controller, Get, UseGuards } from '@nestjs/common';
import { CustomerGuard } from '~/customer/customer.guard';
import { CustomerService } from '~/customer/customer.service';
import { GetSession } from '~/session/session.decorator';

@UseGuards(CustomerGuard)
@Controller('website')
export class WebsiteController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('list')
  async list(
    @GetSession('appId') appId: string,
    @GetSession('channelId') channelId: string,
    @GetSession('customerId') customerId: string
  ) {
    const customer = await this.customerService.getById(appId, customerId);

    return {
      isSuccess: true,
      customer,
    };
  }
}
