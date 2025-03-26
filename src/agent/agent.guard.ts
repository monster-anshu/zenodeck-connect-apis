import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { ConnectAppService } from '~/connect-app/connect-app.service';
import { USER_SERVICE_DOMAIN } from '~/env';
import CompanyUserPermissionModel from '~/mongo/common/schema/CompanyUserPermission';
import { AgentService } from './agent.service';

@Injectable()
export class AgentGuard implements CanActivate {
  constructor(
    private readonly connectAppService: ConnectAppService,
    private readonly agentService: AgentService
  ) {}
  async canActivate(context: ExecutionContext) {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const session = request.session;

    if (!session) {
      throw new UnauthorizedException();
    }

    const { userId, companyId: parentCompanyId, connectApp } = session || {};
    let { appId, companyId } = connectApp || {};
    companyId = companyId || parentCompanyId;

    if (userId && !companyId) {
      const userCompanies = await CompanyUserPermissionModel.find(
        {
          products: { $in: ['CONNECT'] },
          userId,
          status: 'ACTIVE',
        },
        { companyId: 1 },
        {
          limit: 2,
        }
      ).lean();
      if (userCompanies?.length == 1) {
        companyId = userCompanies[0]?.companyId.toString();
        session.connectApp = {
          companyId,
        };
      } else if (!userCompanies?.length) {
        response.header(
          'x-zenodeck-redirect',
          `${USER_SERVICE_DOMAIN}/fill-details?productId=CONNECT`
        );
      } else {
        response.header(
          'x-zenodeck-redirect',
          `${USER_SERVICE_DOMAIN}/company-list?productId=CONNECT`
        );
      }
    }
    if (!userId || !companyId) {
      throw new UnauthorizedException();
    }

    const [appInfo] = await Promise.all([
      this.connectAppService.get({
        appId,
        companyId,
        projection: {
          encryption: 1,
          companyId: 1,
        },
      }),
    ]);

    if (!appInfo) {
      throw new UnauthorizedException();
    }

    appId = appInfo._id.toString();
    session.connectApp = {
      appId,
      companyId,
    };

    const userInfo = await this.agentService.getAgentInfoWithRole({
      appId,
      userId,
      fetchRole: true,
      decrypted: true,
    });

    if (!userInfo) {
      throw new UnauthorizedException();
    }
    request.userInfo = userInfo;
    request.appInfo = appInfo;
    return true;
  }
}
