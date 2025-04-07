import { APIGatewayEvent, Handler } from 'aws-lambda';
import { socketService } from '~/socket/sls';
import { SocketAuthorizerContext } from '../authorizer/authorizer';

export const handler: Handler<APIGatewayEvent> = async (event) => {
  const connectionId = event.requestContext.connectionId;

  if (!connectionId) {
    throw new Error('Invalid event. Missing `connectionId` parameter.');
  }

  const { appId, customerId, type, userId } = (event.requestContext
    .authorizer || {}) as SocketAuthorizerContext;

  const useIdToUse = type == 'CUSTOMER' ? customerId : userId;

  await socketService.removeConnection(appId, {
    connectionId,
    fromSocketDisconnectEvent: true,
    userId: useIdToUse!,
    userType: type,
  });

  return {
    statusCode: 200,
  };
};
