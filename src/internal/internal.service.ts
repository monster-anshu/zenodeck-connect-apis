import { Injectable } from '@nestjs/common';
import { AgentService } from '~/agent/agent.service';
import { ChannelService } from '~/channel/channel.service';
import { ConnectAppService } from '~/connect-app/connect-app.service';
import { CustomFieldService } from '~/custom-field/custom-field.service';
import { RoleService } from '~/role/role.service';
import { PopulateDefaultDto } from './dto/populate-default.dto';

@Injectable()
export class InternalService {
  constructor(
    private readonly roleService: RoleService,
    private readonly connectAppService: ConnectAppService,
    private readonly agentService: AgentService,
    private readonly customFieldService: CustomFieldService,
    private readonly channelService: ChannelService
  ) {}

  async populateDefault({
    companyId,
    companyName,
    userId,
  }: PopulateDefaultDto) {
    const editAppDetails = await this.connectAppService.createDefault({
      companyId,
      companyName,
    });

    const appId = editAppDetails?._id;
    if (!appId) {
      return null;
    }

    const [roleId] = await Promise.all([
      this.roleService.createDefault(appId.toString(), userId),
      this.customFieldService.createDefault(appId.toString()),
      this.channelService.createDefault(appId.toString()),
    ]);

    const createdAgents = await this.agentService.createAgents({
      appId: appId.toString(),
      userIds: [userId],
      roleId: roleId.toString(),
    });

    const agent = createdAgents[0];

    return agent || null;
  }
}
