import type {
  APIGatewayAuthorizerEvent,
  APIGatewayAuthorizerResultContext,
  Handler,
  PolicyDocument,
} from 'aws-lambda';
import verifyJwt from '~/lib/jwt/verify';

const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string
) => {
  const authResponse = {
    principalId: principalId,
  } as {
    policyDocument: PolicyDocument;
    principalId: string;
    context: APIGatewayAuthorizerResultContext;
  };

  authResponse.principalId = principalId;
  if (effect && resource) {
    authResponse.policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: resource,
        },
      ],
    };
  }
  return authResponse;
};

export const handler: Handler<APIGatewayAuthorizerEvent> = async (
  event,
  _context,
  callback
) => {
  const authorizationToken =
    'queryStringParameters' in event
      ? event.queryStringParameters?.['token']
      : null;

  if (!authorizationToken) {
    callback('Unauthorized');
    return;
  }

  const session = await verifyJwt(authorizationToken);

  if (!session) {
    callback('Unauthorized');
    return;
  }

  const policy = generatePolicy('user', 'Allow', event.methodArn);
  const userIdToUse =
    session?.type === 'CUSTOMER' ? session.customerId : session?.userId;
  const appId = session?.connectApp?.appId;

  if (appId && userIdToUse) {
    policy.context = {
      appId: appId,
      userId: session.type == 'AGENT' ? session.userId : '',
      customerId: session.type == 'CUSTOMER' ? session.customerId : '',
      type: session.type,
    };
    callback(null, policy);
    return;
  }

  callback('Unauthorized');
};
