import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AgentGuard } from '~/agent/agent.guard';
import { GetSession } from '~/session/session.decorator';
import { CustomFieldService } from './custom-field.service';
import { CreateCustomFieldDto } from './dto/custom-field-create.dto';

@UseGuards(AgentGuard)
@Controller('custom-field')
export class CustomFieldController {
  constructor(private readonly customFieldService: CustomFieldService) {}

  @Post()
  async create(
    @GetSession('appId') appId: string,
    @GetSession('userId') userId: string,
    @Body() body: CreateCustomFieldDto
  ) {
    const customField = await this.customFieldService.create(
      appId,
      userId,
      body
    );

    return {
      isSuccess: true,
      customField,
    };
  }

  @Get()
  async list(@GetSession('appId') appId: string) {
    const customFields = await this.customFieldService.list(appId);

    return {
      isSuccess: true,
      customFields,
    };
  }
}
