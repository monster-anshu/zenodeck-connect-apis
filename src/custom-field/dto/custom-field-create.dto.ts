import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  CUSTOM_FIELD_STATUS,
  CUSTOM_FIELD_TYPES,
} from '~/mongo/connect/custom-field.schema';

export const CreateCustomFieldZod = z.object({
  choices: z.array(z.string().trim()),
  description: z.string().trim().optional(),
  label: z.string().trim(),
  name: z
    .string()
    .trim()
    .regex(/^[^\s\W]+$/),
  type: z.enum(CUSTOM_FIELD_TYPES),
  status: z.enum(CUSTOM_FIELD_STATUS),
});

export class CreateCustomFieldDto extends createZodDto(CreateCustomFieldZod) {}
