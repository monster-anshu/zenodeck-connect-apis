import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CustomFieldService } from '~/custom-field/custom-field.service';
import { CustomerModelProvider } from '~/mongo/connect/customer.schema';

@Injectable()
export class CustomerService {
  constructor(
    @Inject(CustomerModelProvider.provide)
    private readonly customerModel: typeof CustomerModelProvider.useValue,
    private readonly customFieldService: CustomFieldService
  ) {}

  async create(
    appId: string,
    channelId: string,
    fields: Record<string, string> & { emailId?: string }
  ) {
    const customFields = await this.customFieldService.list(appId, ['ACTIVE']);

    const fieldsToInsert: Record<string, unknown> = {};

    customFields.forEach((customField) => {
      const value = fields[customField.name];
      const result = CustomFieldService.validate(customField, value);
      if (!result.success) {
        const issue = result.error.issues.at(0);
        throw new UnprocessableEntityException(
          `${customField.name}: ${issue?.message}`
        );
      }
      fieldsToInsert[customField.name] = result.data;
    });

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
