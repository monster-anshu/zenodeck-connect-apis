import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { hexColor } from '~/mongo/connect/customization-zod';

const CreateChannelZod = z.object({
  name: z.string().trim().nonempty(),
  description: z.string().trim().optional(),
  primaryColor: hexColor,
});

export class CreateChannelDto extends createZodDto(CreateChannelZod) {}
