import { APIGatewayEvent, Handler } from 'aws-lambda';
import { SocketConnectionModelProvider } from '~/mongo/connect/socket-connection.schema';
import { SocketAuthorizerContext } from '../authorizer/authorizer';

export const handler: Handler<APIGatewayEvent> = async (event) => {
  const connectionId = event.requestContext.connectionId;

  if (!connectionId) {
    throw new Error('Invalid event. Missing `connectionId` parameter.');
  }

  const { appId, customerId, type, userId } = (event.requestContext
    .authorizer || {}) as SocketAuthorizerContext;

  const useIdToUse = type == 'CUSTOMER' ? customerId : userId;

  await Promise.all([
    SocketConnectionModelProvider.useValue.updateOne(
      {
        appId,
        userId: useIdToUse,
        userType: type,
      },
      {
        $push: {
          connections: {
            connectionId,
          },
        },
        $setOnInsert: {
          appId,
          userInfo: {
            type,
            userId: useIdToUse,
          },
        },
      },
      {
        upsert: true,
      }
    ),
  ]);

  return {
    statusCode: 200,
  };
};
