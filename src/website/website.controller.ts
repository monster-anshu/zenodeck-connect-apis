import { Controller, UseGuards } from '@nestjs/common';
import { CustomerGuard } from '~/customer/customer.guard';

@UseGuards(CustomerGuard)
@Controller('website')
export class WebsiteController {}
