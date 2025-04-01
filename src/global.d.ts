import 'fastify';
import { AgentDetails } from './mongo/connect/agent.schema';
import { ConnectApp } from './mongo/connect/connect-app';
import {
  AgentSession,
  CustomerSession,
  Session,
} from './session/session.decorator';

declare module 'fastify' {
  interface FastifyRequest {
    userInfo?: AgentDetails;
    appInfo?: ConnectApp;
    agentSession?: AgentSession | null;
    customerSession?: CustomerSession;
  }
}
