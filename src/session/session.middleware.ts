import type { FastifyReply, FastifyRequest } from 'fastify';
import verifyJwt from '~/lib/jwt/verify';

export const SessionMiddlewareFn = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const agentToken = async () => {
    const token = req.cookies?.__session;
    if (!token) {
      return;
    }
    const decoded = await verifyJwt(token);
    if (decoded?.type !== 'AGENT') return;
    req.agentSession = decoded;
  };
  const customerToken = async () => {
    const token = req.headers['authorization'];
    if (!token) {
      return;
    }
    const decoded = await verifyJwt(token);
    if (decoded?.type !== 'CUSTOMER') return;
    req.customerSession = decoded;
  };
  await agentToken();
  await customerToken();
  // req.setSession = (key, value) => {
  //   if (!req.session) return;
  //   if (!value) {
  //     delete req.session?.[key];
  //     return;
  //   }
  //   req.session[key] = value;
  // };
};
