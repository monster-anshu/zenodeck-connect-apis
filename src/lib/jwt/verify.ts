import { verify } from 'jsonwebtoken';
import { SESSION_JWT_SECRET } from '~/env';
import { AgentSession, CustomerSession } from '~/session/session.decorator';

if (!SESSION_JWT_SECRET) {
  throw new Error('SESSION_JWT_SECRET is not defined');
}

const verifyJwt = (
  token: string
): Promise<AgentSession | CustomerSession | null> => {
  return new Promise((resolve) => {
    if (!token) {
      return resolve(null);
    }
    verify(token, SESSION_JWT_SECRET, (_err, decoded) => {
      if (typeof decoded !== 'object' || !('data' in decoded)) {
        return resolve(null);
      }
      const payload = decoded?.data as AgentSession | CustomerSession | null;
      if (!payload) {
        return resolve(null);
      }
      if (payload.type !== 'CUSTOMER') {
        payload.type = 'AGENT';
      }
      resolve(payload);
    });
  });
};

export default verifyJwt;
