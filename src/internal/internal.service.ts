import { Injectable } from '@nestjs/common';
import { AgentService } from '~/agent/agent.service';
import { ConnectAppService } from '~/connect-app/connect-app.service';
import { CustomFieldService } from '~/custom-field/custom-field.service';
import { MONGO_CONNECTION } from '~/mongo/connections';
import { RoleService } from '~/role/role.service';
import { PopulateDefaultDto } from './dto/populate-default.dto';

@Injectable()
export class InternalService {
  constructor(
    private readonly roleService: RoleService,
    private readonly connectAppService: ConnectAppService,
    private readonly agentService: AgentService,
    private readonly customFieldService: CustomFieldService
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

    const agent = await MONGO_CONNECTION.DEFAULT.transaction(async () => {
      // not using Promise.all due to transaction does not support it
      const roleId = await this.roleService.createDefault(
        appId.toString(),
        userId
      );

      await this.customFieldService.createDefault(appId.toString());

      const createdAgents = await this.agentService.createAgents({
        appId: appId.toString(),
        userIds: [userId],
        roleId: roleId.toString(),
      });

      const agent = createdAgents[0];

      return agent || null;
    });

    return agent;
  }
}
