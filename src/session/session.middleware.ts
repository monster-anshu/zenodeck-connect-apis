import type { FastifyReply, FastifyRequest } from 'fastify';

export const onHeader = async (req: FastifyRequest, res: FastifyReply) => {};

export const SessionMiddlewareFn = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const token = req.cookies?.__session;

  if (!token) {
    return;
  }
};
