import { ConflictException, Inject, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { z, ZodSchema } from 'zod';
import {
  CustomField,
  CustomFieldModelProvider,
} from '~/mongo/connect/custom-field.schema';
import { predefinedFields } from './custom-field';
import { CreateCustomFieldDto } from './dto/custom-field-create.dto';

@Injectable()
export class CustomFieldService {
  constructor(
    @Inject(CustomFieldModelProvider.provide)
    private customFieldModel: typeof CustomFieldModelProvider.useValue
  ) {}

  async create(
    appId: string,
    userId: string,
    { choices, label, name, type, description, status }: CreateCustomFieldDto
  ) {
    const existingFieldWithNameOrLabel = await this.customFieldModel.findOne({
      appId,
      $or: [
        {
          name: { $regex: new RegExp('^' + name + '$', 'i') },
        },
        {
          label: { $regex: new RegExp('^' + label + '$', 'i') },
        },
      ],
    });

    if (existingFieldWithNameOrLabel) {
      throw new ConflictException('NAME_OR_LABEL_ALREADY_EXISTS');
    }

    const customField = await this.customFieldModel.create({
      appId,
      choices,
      createdBy: userId,
      custom: true,
      description,
      label,
      name,
      status: status,
      type,
    });

    return customField.toObject();
  }

  async createDefault(appId: string) {
    const fields = predefinedFields.map((item, index) => ({
      ...item,
      sequence: index + 1,
      appId,
    }));

    const createdField = await this.customFieldModel.create(fields);

    return createdField;
  }

  async list(
    appId: string,
    status: CustomField['status'][] = ['ACTIVE', 'INACTIVE']
  ) {
    const customFields = await this.customFieldModel
      .find({
        appId,
      })
      .lean();

    return customFields;
  }

  static validate(customField: CustomField, value: unknown) {
    const schema = record[customField.type];
    const result = schema.safeParse(value);
    return result;
  }
}

const record: Record<CustomField['type'], ZodSchema> = {
  EMAIL: z.string().email(),
  TEXT: z.string().nonempty(),
};
