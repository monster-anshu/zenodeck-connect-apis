import { APIGatewayEvent, Handler } from 'aws-lambda';

export const handler: Handler<APIGatewayEvent> = async (event) => {
  return {
    statusCode: 200,
  };
};
