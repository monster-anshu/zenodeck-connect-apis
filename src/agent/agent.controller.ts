import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { CONNECT_APP_SOCKET_URL } from '~/env';
import signJwt from '~/lib/jwt/sign';
import { AgentDetails } from '~/mongo/connect/agent.schema';
import { GetAgentInfo, GetSession } from '~/session/session.decorator';
import { AgentGuard } from './agent.guard';

@UseGuards(AgentGuard)
@Controller('agent')
export class AgentController {
  @Get('info')
  async get(
    @GetSession('appId') appId: string,
    @GetSession('userId') userId: string,
    @GetSession('companyId') companyId: string,
    // @GetCompanyPlan() companyPlan: CompanyPlan,
    @Req() req: FastifyRequest,
    @GetAgentInfo() agentInfo: AgentDetails
  ) {
    const appInfo = req.appInfo;
    if (!appInfo) {
      throw new UnauthorizedException('Forbidden');
    }
    delete (appInfo as Record<string, unknown>).encryption;
    return {
      isSuccess: true,
      appInfo,
      agentInfo,
      authToken: signJwt({
        companyId: appInfo.companyId.toString(),
        connectApp: {
          appId: appInfo._id.toString(),
          companyId: appInfo.companyId.toString(),
        },
        type: 'AGENT',
        userId: agentInfo.userId.toString(),
      }),
      socketUrl: CONNECT_APP_SOCKET_URL,
      //   planInfo: companyPlan,
      //   country: req.headers['cloudfront-viewer-country-name'] || '',
      //   countryCode: req.headers['cloudfront-viewer-country'] || '',
    };
  }
}
