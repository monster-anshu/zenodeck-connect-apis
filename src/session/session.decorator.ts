import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { AgentDetails } from '~/mongo/connect/agent.schema';
import { ConnectApp } from '~/mongo/connect/connect-app';

export type AgentSession = {
  type: 'AGENT';
  userId?: string;
  companyId?: string;
  connectApp?: {
    appId?: string;
    companyId?: string;
  };
};

export type CustomerSession = {
  type: 'CUSTOMER';
  customerId?: string;
  connectApp?: {
    appId?: string;
    channelId?: string;
  };
};

type SessionKeys =
  | 'userId'
  | 'companyId'
  | 'customerId'
  | 'appId'
  | 'channelId';

export const GetSession = createParamDecorator(
  (key: SessionKeys, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();

    if (key === 'appId') {
      return request.appInfo?._id?.toString();
    }
    if (key === 'companyId') {
      return request.appInfo?.companyId?.toString();
    }
    if (key === 'userId') {
      return request.userInfo?.userId?.toString();
    }
    if (key === 'channelId') {
      return request.customerSession?.connectApp?.channelId;
    }
    if (key === 'customerId') {
      return request.customerSession?.customerId;
    }
  }
);

export const GetAgentInfo = createParamDecorator(
  async (_: unknown, ctx: ExecutionContext): Promise<AgentDetails> => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    return request.userInfo!;
  }
);

export const GetConnectApp = createParamDecorator(
  async (_: unknown, ctx: ExecutionContext): Promise<ConnectApp> => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    return request.appInfo!;
  }
);

// export const GetCompanyPlan = createParamDecorator(
//   (_, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest<FastifyRequest>();
//     return request.companyPlan;
//   }
// );
