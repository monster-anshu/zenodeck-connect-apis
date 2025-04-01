import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const InitiateWebsiteChatZod = z.record(z.string());

export class InitiateWebsiteChatDto extends createZodDto(
  InitiateWebsiteChatZod
) {}
