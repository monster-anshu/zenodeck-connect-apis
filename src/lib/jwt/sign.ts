import { sign } from 'jsonwebtoken';
import { SESSION_JWT_SECRET } from '~/env';
import { AgentSession, CustomerSession } from '~/session/session.decorator';

if (!SESSION_JWT_SECRET) {
  throw new Error('SESSION_JWT_SECRET is not defined');
}

const signJwt = (
  data: AgentSession | CustomerSession,
  options: { expiresIn?: number } = {}
) => {
  const { expiresIn } = options;
  return sign(
    {
      data,
    },
    SESSION_JWT_SECRET,
    { expiresIn: expiresIn || 90 * 24 * 60 * 60 }
  );
};

export default signJwt;
