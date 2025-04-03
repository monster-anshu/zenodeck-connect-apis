import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MESSAGE_DATA_TYPE } from '~/mongo/connect/activity.schema';

const SendMessageZod = z.object({
  type: z.enum(MESSAGE_DATA_TYPE),
  message: z.string().nonempty(),
});

export class SendMessageDto extends createZodDto(SendMessageZod) {}
