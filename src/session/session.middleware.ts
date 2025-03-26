import type { FastifyReply, FastifyRequest } from 'fastify';
import verifyJwt from '~/lib/jwt/verify';

export const onHeader = async (req: FastifyRequest, res: FastifyReply) => {};

export const SessionMiddlewareFn = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const token = req.cookies?.__session;

  if (!token) {
    return;
  }

  const decoded = await verifyJwt(token);
  req.session = decoded;
  req.setSession = (key, value) => {
    if (!req.session) return;
    if (!value) {
      delete req.session?.[key];
      return;
    }
    req.session[key] = value;
  };
};
