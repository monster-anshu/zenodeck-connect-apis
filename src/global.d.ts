import 'fastify';
import { AgentDetails } from './mongo/connect/agent.schema';
import { ConnectApp } from './mongo/connect/connect-app';
import { Session, SetSessionType } from './session/session.decorator';

declare module 'fastify' {
  interface FastifyRequest {
    userInfo?: AgentDetails;
    appInfo?: ConnectApp;
    session: Session | null;
    setSession: SetSessionType;
  }
}
