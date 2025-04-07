import { APIGatewayEvent, Handler } from 'aws-lambda';

export const handler: Handler<APIGatewayEvent> = async (event) => {
  const connectionId = event.requestContext.connectionId;

  if (!connectionId) {
    throw new Error('Invalid event. Missing `connectionId` parameter.');
  }

  return {
    statusCode: 200,
  };
};
